import config from '../config'

const successStatus = [200, 201, 202, 204]
const failedStatus = [400, 401, 402, 404, 409, 422]
const needsRefreshStatus = [403]

export async function getApiData(pathName: string) {
    const controller = new AbortController()
    const url = `http://${location.hostname}:${config.port}/api${pathName}`
    console.log(url)
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    const responseData = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        signal: controller.signal
    })
    console.log(responseData)
    return Promise.resolve(responseData)
}

export async function postApiData(pathName: string, body: string | object | null) {
    const controller = new AbortController()
    const url = `http://${location.hostname}:${config.port}/api${pathName}`
    console.log(url)
    console.log(body)
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    const responseData = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? body as string :  "{}",
        signal: controller.signal
    })
    console.log(responseData)
    return Promise.resolve(responseData)
}

export async function deleteApiData(pathName: string, body: string | object | null) {
    const controller = new AbortController()
    const url = `http://${location.hostname}:${config.port}/api${pathName}`
    console.log(url)
    console.log(body)
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    const responseData = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
        body: body ? body as string :  "{}",
        signal: controller.signal
    })

    return Promise.resolve(responseData)
}

export async function patchApiData(pathName: string, body: string | object | null) {
    const controller = new AbortController()
    const url = `http://${location.hostname}:${config.port}/api${pathName}`
    console.log(url)
    console.log(body)
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    const responseData = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? body as string : "{}",
        signal: controller.signal
    })
    console.log(responseData)
    return Promise.resolve(responseData)
}
export async function getAccessToken() {
    const refreshData = await fetch(`http://${location.hostname}:${config.authPort}/token`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': `http://${location.hostname}:${config.authPort}`
        }
    })
    return Promise.resolve(refreshData)
}



export async function handleApiData(pathName: string | null, setState: Function | null, action: string | null, body: string | object | null) {
    console.log('handling!')
    console.log(pathName)
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
            console.log('GET')
            responseData = await getApiData(pathName)
            break
        }
        case "post": {
            console.log('POST')
            responseData = await postApiData(pathName, body)
            break
        }
        case "delete": {
            console.log('DELETE')
            responseData = await deleteApiData(pathName, body)
            break
        }
        case "patch": {
            console.log('PATCH')
            responseData = await patchApiData(pathName, body)
            break
        }
    }
     
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
            //if the accesss token request gives a response status is succesfull, retry the request.
            console.log('refresh successful!')
            handleApiData(pathName, setState, action, body)
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