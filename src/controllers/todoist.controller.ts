import { AxiosInstance, AxiosResponse } from 'axios'
import Axios from 'axios'
import { ConfigService } from '../config/config.service'

const configService: ConfigService = new ConfigService()

export class TodoistController {
  public static axiosInstance: AxiosInstance
  constructor() {
    TodoistController.axiosInstance = Axios.create({
      baseURL: `${configService.get('TODOIST_API_URL')}`,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${configService.get('TODOIST_API_TOKEN')}`,
        'Content-Type': 'application/json'
      }
    })
  }

  public async sendGetRequest(endPoint: string): Promise<AxiosResponse> {
    let data: AxiosResponse
    try {
      data = await TodoistController.axiosInstance.get(endPoint)
    } catch (err) {
      console.log('Error when GET Todoist API')
      if (err.response) {
        console.log(
          'the GET request was made but status >= 400',
          JSON.stringify({
            code: err.response.status,
            msg: err.response.statusText,
            data: err.response.data
          })
        )
      } else if (err.request) {
        console.log(
          'the GET request was made but no response was received',
          err.code
        )
      }
      console.log(err.config)
      throw new Error("Error: Can't connect to the Todoist API")
    }

    return data
  }

  public async sendPostRequest(
    endPoint: string,
    body: any
  ): Promise<AxiosResponse> {
    let data: AxiosResponse
    try {
      data = await TodoistController.axiosInstance.post(endPoint, body)
    } catch (err) {
      console.log('Error when contacting POST Todoist API')
      if (err.response) {
        console.log(
          'the POST request was made but status >= 400',
          JSON.stringify({
            code: err.response.status,
            msg: err.response.statusText,
            data: err.response.data
          })
        )
      } else if (err.request) {
        console.log(
          'the POST request was made but no response was received',
          err.code
        )
      }
      console.log(err.config)
      throw new Error("Error: Can't connect to the Todoist API")
    }

    return data
  }
}
