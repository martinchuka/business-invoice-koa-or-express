const htmlPdf=require('html-pdf');
const invoiceString=require('./invoice.html');


class PdfGenerator{

    constructor(title='Invoice'){
        this.started=new Date().getMilliseconds();
        this._options={
            "format": "Letter",
            "orientation": "portrait",
            "header": {
                "height": "10mm",
                "contents": '<div style="text-align: right; font-style: italic;font-size:12px; color:#2F3C66; font-family: \'Ubuntu Italic\',sans-serif;">'+title+'</div>'
            },
        };
        this._invoiceNumber=new Date().getMilliseconds().toString();
        this._invoiceDate=new Date();
        this._invoiceDue=new Date(new Date().setDate(new Date().getDate()+7));
        this.client={ };

        //name:'',address:'',city:'',zip:''
        this._taxPercentage=0;
        this._discount=0;


        this._logo='https://placehold.it/300x300';
        this._items=[]; //name,unitCost,qty,amount
    }

    /**
     * Client to send invoice to
     * throws exception if values are not specified
     * @param name
     * @param address
     * @param city
     * @param zip
     */
    addClient(name,address,city,zip){
        if(!name || !address || !city || !zip){
            throw new Error('constructor name, address, city and zip are required')
        }
        this.client.name=name;
        this.client.address=address;
        this.client.city=city;
        this.client.zip=zip;
    }


    /*
    Generates the pdf and returns the path, can throw exception
     */
    generatePdfInvoice(){
        if(!this._items.length){
            console.error('No item added to Invoice');
            return;
        }

        if(!this.client.hasOwnProperty('name')){
            console.error('client is not added to invoice');
            return;
        }
        const htmlString=invoiceString(this._invoiceNumber,this.client,this._logo,this.invoiceDate,this._items,this.invoiceDue,{tax:this._taxPercentage,discount:this._discount});
        //pdf name
        const pdfName=(new Date()).getMilliseconds().toString()+'.pdf';

        //checking how many time it took to complete the process
        return new Promise((resolve,reject)=>{
            htmlPdf.create(htmlString,this._options).toFile('./'+pdfName,(error,response)=>{
                if(error)reject(error);
                const took=((new Date().getMilliseconds())-this.started)+' ms';

                resolve({
                    path:'./'+pdfName,
                    took
                });
            })
        })
    }

    /*
    Add item to the invoice
    required name, unitCost & quantity -> amount are calculated
     */
    addItem(name,uCost,qty){
            if(!name){
                throw new Error('Name is not defined');
            }
            if(!uCost || (uCost |0)<1){
                throw new Error('Unit cost is not defined or incorrect value. Must be a number');
            }

            if(!qty || (qty |0)<1){
                throw new Error('Quantity is not defined or incorrect value. Must be a number');
            }

            this._items.push({
                name,
                unitCost:uCost,
                qty,
                amount:(uCost |0)*(qty|0)
            });
            return this._items.length - 1;
    }

    removeItem(index){
        if(this._items[index]){
            this._items.splice(index,1);
            return true;
        }
    }

    set invoiceDue(value) {
        this._invoiceDue = value;
    }

    get invoiceDate() {
        return `${this._invoiceDate.getDate()>9?this._invoiceDate.getDate():'0'+this.invoiceDue.getDate()}/${this._invoiceDate.getMonth()>8?this._invoiceDate.getMonth()+1:'0'+(this._invoiceDue.getMonth()+1)}/${this._invoiceDate.getFullYear()}`;
    }

    get invoiceDue() {
        return `${this._invoiceDue.getDate()>9?this._invoiceDue.getDate():'0'+this._invoiceDue.getDate()}/${this._invoiceDue.getMonth()>8?this._invoiceDue.getMonth()+1:'0'+(this._invoiceDue.getMonth()+1)}/${this._invoiceDue.getFullYear()}`;
    }

    set discount(value) {
        if((value | 0 )){
            this._discount = value;

        }
    }

    set taxPercentage(value) {
        if((value | 0 )) {
            this._taxPercentage = value;
        }
    }

    set invoiceNumber(value) {
        this._invoiceNumber = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }


    get items() {
        return this._items;
    }

    set logo(value) {
        this._logo = value;
    }
}


module.exports=PdfGenerator;