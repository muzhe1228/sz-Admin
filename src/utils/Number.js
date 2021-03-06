import {Decimal} from 'decimal.js';

// //console.log(new Decimal(0.0001).mul(new Decimal(0.00001)).toNumber())

class Number {
    static scientificToNumber = (num) => {
        var str = num.toString();
        //console.log(str)
        if (!str) {
            return ''
        }
        var reg = /^(\d+)(e)([\-]?\d+)$/;
        var arr, len,
            zero = '';

        /*6e7或6e+7 都会自动转换数值*/
        if (!reg.test(str)) {
            //console.log('数字')

            if (str.indexOf('.') != -1) {
                //console.log('小数')
                let arr = str.split('.')
                //console.log('分离', arr)

                if (arr[1].length > 9) {
                    //console.log('77777')

                    //console.log(arr[1])
                    arr[1] = arr[1].substring(0, 8)
                    return arr[0] + `.` + arr[1]
                } else {
                    return num

                }
            } else {
                return num
            }
        } else {
            /*6e-7 需要手动转换*/
            arr = reg.exec(str);
            len = Math.abs(arr[3]) - 1;
            for (var i = 0; i < len; i++) {
                zero += '0';
            }
            return '0.' + zero + arr[1];
        }
    }
    static mul = (age1, age2) => {
        if (!age1 || !age2) {
            return 0
        }
        let results = new Decimal(age1).mul(new Decimal(age2)).toNumber()
        return results
    }
}

export default Number