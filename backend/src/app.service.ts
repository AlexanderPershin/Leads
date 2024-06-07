import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

interface Status {
  "id": number;
  "name": string;
  "sort": number;
  "is_editable": boolean;
  "pipeline_id": number;
  "color": string;
  "type": number;
  "account_id": number;
  "_links": {
    "self": {
      "href": string;
    }
  }
}

interface User {
  "id": number;
  "name": string;
  "email": string;
  "lang": string;
  [x: string | number | symbol]: unknown;
}

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) { }

  async getLeads(query: any): Promise<any> {
    const page = query.page || 1
    const limit = query.limit || 1000
    const queryParam = query.query?.length > 3 ? query.query : ''

    let url = `${process.env.BASE_URL}?page=${page}&limit=${limit}`
    if (queryParam) {
      url += `&query=${queryParam}`
    }


    const headers = {
      'Authorization': `Bearer ${process.env.TOKEN}`,
    }
    try {
      const res = await firstValueFrom(this.httpService.get(url, { headers }))

      const data = res.data

      const pipelineId = data._embedded.leads?.[0]?.pipeline_id || 1

      const statusesUrl = `${process.env.BASE_URL}/pipelines/${pipelineId}/statuses`
      const statusesRes = await firstValueFrom(this.httpService.get(statusesUrl, { headers }))
      const statusesData = statusesRes.data._embedded.statuses

      let returnData = { ...data }
      let newLeads = returnData._embedded.leads

      const usersUrl = `${process.env.CORE_URL}/users`
      const usersRes = await firstValueFrom(this.httpService.get(usersUrl, { headers }))
      const usersData = usersRes.data._embedded.users

      for (let lead of newLeads) {
        const statusId = lead.status_id
        const userId = lead.responsible_user_id
        const currentStatus = statusesData.find((item: Status) => item.id === statusId)
        const currentUser = usersData.find((item: User) => item.id === userId)
        lead.status = currentStatus
        lead.responsible_user = currentUser
      }

      return returnData
    } catch (error) {
      console.error('error: ', error)
    }

    return { msg: "Failed to get leads" }
  }
}
