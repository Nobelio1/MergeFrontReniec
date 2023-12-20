import {Result} from "../../masters/models/result.model";

export class GetFileOut extends  Result {
  data: GetFileData;
  constructor() {
    super();
    this.data = new GetFileData();
  }
}

export class GetFileData {
  archivo: any;
  nombre: string;
  constructor() {
    this.archivo = '';
    this.nombre = '';
  }
}

export class UploadOut extends Result {
  data: string;
  constructor() {
    super();
    this.data = '';
  }
}

export class DeleteOut extends Result {
  data: string;
  constructor() {
    super();
    this.data = '';
  }
}
export class FileT01 {
  dataP1B64: string;
  extension: string;
  name: string;
  sizeBytes: number;
  sizeLabel: string;
  uriDownload: string;
  uuidFile: string;
  // file: File | undefined;
  constructor() {
    this.dataP1B64 = '';
    this.extension = '';
    this.name = '';
    this.sizeBytes = 0;
    this.sizeLabel = '';
    this.uriDownload = '';
    this.uuidFile = '';
    // this.file = undefined;
  }
}
