export function requiredFileType(type: string[]) {
  return function(control: any) {
    const file = control.value;
    let existValue = false;
    if (file) {

      const typeRealFile = file.files[0].type;

      for (let i = 0; i < type.length; i++) {
        const typeFile = type[i].toUpperCase();
        switch (typeFile) {
          case 'PDF':
            if (typeRealFile === 'application/pdf') {
              existValue = true;
            }
            break;
          case 'JPG':
            if (typeRealFile === 'image/jpeg') {
              existValue = true;
            }
            break;
          case 'PNG':
            if (typeRealFile === 'image/png') {
              existValue = true;
            }
            break;
          case 'DOC':
            if (typeRealFile === 'application/msword' || typeRealFile === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
              existValue = true;
            }
            break;
          case 'XLS':
            if (typeRealFile === 'application/vnd.ms-excel' || typeRealFile === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
              existValue = true;
            }
            break;
        }
      }
      if (existValue) {
        return null;
      } else {
        return {
          requiredFileType: true
        };
      }
    }
    return null;
  };
}
