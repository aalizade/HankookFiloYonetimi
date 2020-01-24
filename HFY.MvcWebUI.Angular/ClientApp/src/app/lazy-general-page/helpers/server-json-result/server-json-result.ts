export class ServerJsonResult {
    MessageType:number
    Message:string
    Error: string
    ErrorList:ErrorListModel[]
    Result:any
}

class ErrorListModel{
    ErrorMessage:string
}
