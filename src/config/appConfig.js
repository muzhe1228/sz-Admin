import test_logo from '../resources/img/logo.png'
import test_logo_w from '../resources/img/logo-w.png'

export default {
    szTest: {
        name: 'test',
        httpApi: 'testadmin.sz.com:8688',
        uploadAPI: 'testupload.sz.com',
        logo: test_logo,
        logo_w: test_logo_w,
    },
    szDev: {
        name: 'tests',
        httpApi: 'devadmin.sz.com',
        uploadAPI: 'devupload.sz.com',
        logo: test_logo,
        logo_w: test_logo_w,
    },
    szPro:  {
        name: 'pro',
        httpApi: 'eoeadmin.sz.com',
        uploadAPI: 'upload.sz.com',
        logo: test_logo,
        logo_w: test_logo_w,
    },
    
    getENV: function () {
        return this.szTest;
    }
}
