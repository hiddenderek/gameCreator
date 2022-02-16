import config from '../config'


export async function getApiData(pathName: string) {
    const controller = new AbortController()
    const url = `http://${location.hostname}:${config.port}/api${pathName}`
    console.log(url)
    const timeoutId = setTimeout(() => controller.abort(), 5000)
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
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    const responseData = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? body as string :  "{}",
        signal: controller.signal
    })
    return Promise.resolve(responseData)
}

export async function deleteApiData(pathName: string, body: string | object | null) {
    const controller = new AbortController()
    const url = `http://${location.hostname}:${config.port}/api${pathName}`
    console.log(url)
    console.log(body)
    const timeoutId = setTimeout(() => controller.abort(), 5000)
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
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    const responseData = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? body as string : "{}",
        signal: controller.signal
    })

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
    if (action == "get") {
        responseData = await getApiData(pathName)
    } else if (action == "post") {
        responseData = await postApiData(pathName, body)
    } else if (action == "delete") {
        responseData = await deleteApiData(pathName, body)
    } else if (action == "patch") {
        responseData = await patchApiData(pathName, body)
    }
     
    if (responseData?.status === 200 || responseData?.status === 201 || responseData?.status === 204) {
        const responseResult = await responseData?.text()
        console.log(responseResult)
        try {
            const responseDataResult = responseResult ? JSON.parse(responseResult) : responseData
            if (typeof setState !== "undefined" && setState) {
                setState(responseDataResult)
            }
            return Promise.resolve(responseDataResult)
        } catch (e) {
            console.log(e)
            return Promise.resolve(responseResult)
        }
        
    } else if (responseData?.status === 403) {
        console.log('token not valid, requesting refresh')
        const refreshData = await getAccessToken()
        console.log('refresh')
        if (refreshData.status == 400 || refreshData.status == 401 || refreshData.status == 403 || refreshData.status == 404) {
            console.log('refresh unsuccessful')
        } else {
            console.log('refresh successful!')
            handleApiData(pathName, setState, action, body)
        }
    } else if (responseData?.status === 400 || responseData?.status === 401 || responseData?.status === 404) {
        if (typeof setState !== "undefined" && setState) {
            setState({})
        }
        return Promise.resolve({})
    } else {
        return Promise.resolve({})
    }
}