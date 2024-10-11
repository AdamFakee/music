export const jsonParseHelper = (record) => { // dùng cho phần có 1 mảng bản ghi
    record.forEach(item => {
        if(item['imgs']) {
            item['imgs'] = JSON.parse(item['imgs'])
        }
    })
}

export const jsonParseHelperNotInLoop = (field) => {  // dùng cho phần chỉ có 1 bản ghi
    if(field['imgs']) {
        field['imgs'] = JSON.parse(field['imgs'])
    }
}