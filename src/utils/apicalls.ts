import config from '../config'

export const successStatus = [200, 201, 202, 204]
export const failedStatus = [400, 401, 402, 404, 405, 409, 422, 500, 501, 502]
export const needsRefreshStatus = [403]
export const needsRetryStatus = [503]
export const timeout = 5000


export async function getApiData(pathName: string, port: number | undefined) {
    const controller = new AbortController()
    const url = `https://${location.hostname}:${port ? port : config.port}/api${pathName}`
    setTimeout(() => controller.abort(), timeout)
    try {
        const responseData = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: controller.signal
        })
        return Promise.resolve(responseData)
    } catch (e) {
        return Promise.resolve({ data: "", status: 500, text: ()=>"" })
    }
}

export async function postApiData(pathName: string, body: string | object | null, port: number | undefined) {
    const controller = new AbortController()
    const url = `https://${location.hostname}:${port ? port : config.port}/api${pathName}`
    setTimeout(() => controller.abort(), timeout)
    try {
        const responseData = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? body as string : "{}",
            signal: controller.signal
        })
        console.log(responseData)
        return Promise.resolve(responseData)
    } catch (e) {
        return Promise.resolve({ data: "", status: 500, text: ()=>"" })
    }
}

export async function deleteApiData(pathName: string, body: string | object | null, port: number | undefined) {
    const controller = new AbortController()
    const url = `https://${location.hostname}:${port ? port : config.port}/api${pathName}`
    setTimeout(() => controller.abort(), timeout)
    try {
        const responseData = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
            body: body ? body as string : "{}",
            signal: controller.signal
        })
        return Promise.resolve(responseData)
    } catch (e) {
        return Promise.resolve({ data: "", status: 500, text: ()=>"" })
    }  
}

export async function patchApiData(pathName: string, body: string | object | null, port: number | undefined) {
    const controller = new AbortController()
    const url = `https://${location.hostname}:${port ? port : config.port}/api${pathName}`
    setTimeout(() => controller.abort(), timeout)
    try {
        const responseData = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? body as string : "{}",
            signal: controller.signal
        })
        return Promise.resolve(responseData)
    } catch (e) {
        return Promise.resolve({ data: "", status: 500, text: () => "" })
    }
}
export async function getAccessToken() {
    const refreshData = await fetch(`https://${location.hostname}:${config.authPort}/token`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': `https://${location.hostname}:${config.authPort}`
        }
    })
    return Promise.resolve(refreshData)
}

export async function sendRequest(pathName: string | null, setState: Function | null, action: string | null, body: string | object | null, port?: number) {
    pathName = pathName ? pathName : (location.pathname+location.search)
    body  = body ?? "{}"
    try {
        if (typeof body == "object") {
            body = JSON.stringify(body as object)
        } 
    } catch (e) {
        console.log('error proccessing object')
    }
    let responseData

    switch (action) {
        case "get": {
            responseData = await getApiData(pathName, port)
            break
        }
        case "post": {
            responseData = await postApiData(pathName, body, port)
            break
        }
        case "delete": {
            responseData = await deleteApiData(pathName, body, port)
            break
        }
        case "patch": {
            responseData = await patchApiData(pathName, body, port)
            break
        }
    }
    return Promise.resolve(responseData)
}

export async function handleRequest(pathName: string | null, setState: Function | null, action: string | null, body: string | object | null, port?: number) {
    const responseData = await sendRequest(pathName, setState, action, body, port)
    if (successStatus.includes(responseData?.status as number)) {
        const responseResult = await responseData?.text()
        console.log(responseResult)
        try {
            const responseDataResult = responseResult ? JSON.parse(responseResult) : responseData
            if (typeof setState !== "undefined" && setState) {
                setState(responseDataResult)
            }
            return Promise.resolve({data: responseDataResult, status: responseData?.status})
        } catch (e) {
            console.log(e)
            return Promise.resolve({data: responseResult, status: responseData?.status})
        }
        
    } else if (needsRefreshStatus.includes(responseData?.status as number)) {
        console.log('token not valid, requesting refresh')
        const refreshData = await getAccessToken()
        console.log('refresh')
        //if, after requesting the access token, the response status is still requiring a refresh or is failed, do nothing.
        if (needsRefreshStatus.includes(refreshData.status) || failedStatus.includes(refreshData.status)) {
            console.log('refresh unsuccessful')
            return Promise.resolve({data: null, status: refreshData.status})
        } else {
            //if the accesss token request gives a response status is succesfull, set the status to indicate a request retry is needed.
            console.log('refresh successful!')
            return Promise.resolve({data: null, status: 503})
        }
    } else if (failedStatus.includes(responseData?.status as number)) {
        if (typeof setState !== "undefined" && setState) {
            setState({})
        }
        try {
            const responseResult = await responseData?.text()
            const responseDataResult = responseResult ? JSON.parse(responseResult) : responseData
            return Promise.resolve({data: responseDataResult, status: responseData?.status})
        } catch (e) {
            console.log('ERROR PROCESSING DATA: ' + e)
            return Promise.resolve({data: null, status: responseData?.status})
        }
    } else {
        return Promise.resolve({data: null, status: responseData?.status})
    }
}



export async function handleApiData(pathName: string | null, setState: Function | null, action: string | null, body: string | object | null, port?: number) {
    const responseData = await handleRequest(pathName, setState, action, body, port)
    //if the response status does not specify a retry, then send the current data. 
    if (!needsRetryStatus.includes(responseData?.status as number)) {
        return Promise.resolve({data: responseData?.data, status: responseData?.status})
    } else {
        //if the response data indicates a retry, handle the request again.
        const retryResponseData = await handleRequest(pathName, setState, action, body, port)
        //if the response data doesnt indicate a retry, send the current data and status. 
        if (!needsRetryStatus.includes(retryResponseData?.status as number)) {
            return Promise.resolve({data: retryResponseData?.data, status: retryResponseData?.status})
            //if the response data still indicates a retry, end the function and set the status as an internal server error
        } else {
            return Promise.resolve({data: null, status: 500})
        }
    }
     
   
}
