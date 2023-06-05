/* eslint-disable no-shadow */
/* eslint-disable padding-line-between-statements */
import { useState, useEffect } from 'react'

/**
 * @example
 * const [response, isFetching , setRequest] = useFetch({} as IRequestInfo);
 * const apiRequest = Build you request based on "IRequestInfo" type.
 * setRequest(apiRequest);
 * */

export interface RequestInfo {
  Headers?: Record<string, any>
  Method: 'GET' | 'PUT' | 'POST' | 'PATCH'
  EndPoint: string
  RequestBody?: Record<string, any>
}

export interface ResponseInfo {
  Data: any
  hasError: boolean
}

// eslint-disable-next-line no-restricted-syntax
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  SUCCESS_NO_CONTENT = 204,
}

function useFetch(
  props: RequestInfo
): [ResponseInfo, boolean, React.Dispatch<React.SetStateAction<RequestInfo>>] {
  const [isFetching, setIsFetching] = useState(!!props.EndPoint)
  const [requestInfo, setRequest] = useState(props)
  const [responseInfo, setResponse] = useState({} as ResponseInfo)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (
      Object.keys(requestInfo).length === 0 &&
      requestInfo.constructor === Object
    )
      return

    if (isPending) return

    setIsFetching(!!requestInfo?.EndPoint)
    setIsPending(true)

    console.log(
      '%c FETCHING: ',
      'background: yellow; color: black',
      requestInfo?.EndPoint
    )

    const promise = new Promise((resolve: any, reject: any) => {
      const fetchURL = requestInfo.EndPoint
      const fetchData = {
        ...(requestInfo.RequestBody && {
          body: JSON.stringify(requestInfo.RequestBody),
        }),
        headers: requestInfo.Headers ? requestInfo.Headers : {},
        method: requestInfo.Method,
      }

      fetch(fetchURL, fetchData)
        .then((response: Response) => {
          switch (response.status) {
            case HttpStatusCode.OK:
            case HttpStatusCode.CREATED:
            case HttpStatusCode.SUCCESS_NO_CONTENT:
              response
                .clone()
                .json()
                .then((data: any) => {
                  resolve(data)
                })
                .catch(() => {
                  // Log the Error
                  resolve(null)
                })
              break
            default:
              response
                .clone()
                .json()
                .then((data: any) => {
                  reject(data)
                })
                .catch(() => {
                  // Log the Error
                  reject(null)
                })
          }
        })
        .catch((error: Error) => {
          // Log the Error
          reject(error)
        })
    })

    promise.then(
      (httpResponse: any) => {
        setResponse({ Data: httpResponse, hasError: false })
        setIsFetching(false)
        setIsPending(false)
      },
      (error: Error) => {
        setResponse({ Data: error, hasError: true })
        setIsFetching(false)
        setIsPending(false)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestInfo])

  return [responseInfo, isFetching, setRequest]
}

export default useFetch
