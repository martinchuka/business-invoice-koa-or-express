module.exports=function(invoiceNumber,client,logo,date_issued,items,due_date,additionalOptions={tax:0,discount:0}){
    /**
     * item {
                name,
                unitCost:uCost,
                qty,
                amount:(uCost |0)*(qty|0)
            }
     **/

    let itemStrings='';
    let subTotal=0;
    let tax=0;


    for(let i=0; i<items.length; i++){
        subTotal+=items[i].amount;
        itemStrings+=`<tr>
            <td colspan="3">
                <p>${items[i].name}<p></p>
            </td>
            <td colspan="2">
                <p>${items[i].unitCost}</p>
            </td>
            <td colspan="2">
                <p>${items[i].qty}</p>
            </td>
            <td colspan="3">
                <p>${items[i].amount}</p>
            </td>
        </tr>`
    }
    if(additionalOptions.tax){
        tax=(additionalOptions.tax/100)*subTotal;
    }
    let totalAmount=subTotal+tax;
    totalAmount-=additionalOptions.discount;

    return `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,400i,500&display=swap" rel="stylesheet">

    <style type="text/css">

        /**
                invoice color scheme - add your style color here

         */
        body,html,*{
            font-family:'Ubuntu',sans-serif;
            text-align:left;
        }
        table{
            width:100%;
            margin:0;
            padding:0;
            background:transparent;

        }
        .invoice-container{
            position:relative;
            padding:0px 5px;
            width:610px;
            height:724px;
            display:flex;
            flex-direction:column;
            justify-content:center;
            background:rgba(255,255,255,0.86);
            overflow:hidden;
        }
        .water-mark{
            background-image:url(${logo});            
            position:absolute;
            background-position:center;
            background-repeat:no-repeat;
            background-size:contain;
            bottom:-80px;
            height:500px;
            width:500px;
            right:-80px;
            -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
            filter: grayscale(100%);
            z-index:-1;
            overflow:hidden;
        }

        .logo-holder{
            display:flex;
            flex-direction:row;
            justify-content:flex-end;
        }
        .logo-holder,.invoice-title{
            padding-bottom:20px;

        }

        .logo-holder .logo{
            width:auto;
            height:50px;
            object-fit: contain;
            display:block;
        }
        .invoice-title{
            font-size:50px;
            font-weight:500;
            text-align:left;
            padding-left:20px;
            color:#1C82C8;
        }

        .space-top {
            padding-top: 20px;
        }

        th{
            font-weight:500;
            font-size:16px;
            color:#2F3C66;
        }
        td{
            font-weight:400;
            font-size:14px;
            color:#708198;
        }


        th{
            font-weight:500;
        }


        .separated{
            padding-right:10px;
        }
        .item-details th,.item-details tr:last-child td,.underline th{
            border-bottom:1px solid rgba(0,0,0,0.2);
            padding-bottom:9px;
        }

        .double-underline th{
            border-bottom:1px solid rgba(0,0,0,0.2);
            border-top:1px solid rgba(0,0,0,0.2);
            padding-bottom:9px;
        }
        
        .total{
            font-size:16px;
            display:flex;
            align-items:center;
            font-weight:400;
            padding:15px 20px;
            width:100%;
            -webkit-border-radius:3px;
            -moz-border-radius:3px;
            border-radius:3px;
            background:#CB2026;
            color:white;
        }
        .total span{
            font-weight:500;
            margin-left:10px;
        }
        .pay-with{
            display:flex;
            width:100%;
            flex-direction:row;
            justify-content:space-around;
            align-items:center;
        }

       .pay-with img{
            height:24px;
            margin:0 10px;
        }

        .overdue h4{
            color:#1C82C8;
            font-weight:500;
            font-size:16px;
            margin-bottom:0;
        }

        .overdue p{
            font-weight:400;
            font-size:14px;
        }
        .overdue p .due-date{
            color:#CB2026;
        }
    </style>

</head>
<body>

<div class="invoice-container">
    <table class="table table-responsive">
        <thead>
        <tr>
            <th colspan="3">
                <div class="invoice-title">
                    Invoice
                </div> </th>
            <th colspan="5"></th>

            <th colspan="2">
                <div class="logo-holder">
                    <img src="${logo}" class="logo"/>
                </div>
            </th>
        </tr>


        <tr class="underline">
            <th class="space-top separated" colspan="2">Invoice Number</th>
            <th class="space-top" colspan="2">Date of issue</th>
            <th colspan="6"></th>
        </tr>
        <tr>
            <td class="separated" colspan="2">${invoiceNumber}</td>
            <td class="separated" colspan="2">${date_issued}</td>
            <td colspan="6"></td>
        </tr>
        </thead>
        <thead>
        <tr class="underline">
            <th class="space-top separated" colspan="2">Billed to</th>
            <th class="space-top separated" colspan="4">${client.name}</th>
            <th colspan="4"></th>

        </tr>
        <tr>
            <td colspan="2">Address</td>
            <td colspan="2">${client.address}</td>
            <td colspan="6"></td>

        </tr>
        <tr>
            <td colspan="2">State/Country</td>
            <td colspan="2">${client.city}</td>
            <td colspan="6"></td>

        </tr>
        <tr>
            <td colspan="2">Zip Code</td>
            <td colspan="2">${client.zip}</td>
            <td colspan="6"></td>

        </tr>

        </thead>
        <tbody class="underline item-details">
        <tr>
            <th colspan="3" class="space-top">Description</th>
            <th class="space-top separated" colspan="2">Unit cost</th>
            <th class="space-top separated" colspan="2">Qty/Hr rate</th>
            <th class="space-top separated" colspan="3">Amount</th>
        </tr>
        ${itemStrings}
        </tbody>
        <tbody>
        <tr>
            <td colspan="5" class="space-top"></td>
            <th class="space-top" colspan="2">Subtotal</th>
            <td class="space-top" colspan="3">$ ${subTotal.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5"></td>
            <th colspan="2">Discount</th>
            <td colspan="3">-$ ${additionalOptions.discount.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5"></td>
            <th colspan="2">(Tax rate)</th>
            <td colspan="3">${additionalOptions.tax}%</td>
        </tr>
        <tr>
            <td colspan="5"></td>
            <th colspan="2">Tax</th>
            <td colspan="3">$ ${tax.toFixed(2)}</td>
        </tr>
        </tbody>
        
        <tbody>
        <tr>
            <td colspan="2" class="space-top"></td>
            <td colspan="3" class="space-top">
                <div class="pay-with">
                <img src="https://electrosoft.io/cards/mastercard.png"/>
                <img src="https://electrosoft.io/cards/visa.png"/>
                <img src="https://electrosoft.io/cards/american-express.png"/>
                </div>
            </td>
            <td colspan="5" class="space-top">
                <div class="total">Invoice Total <span>$ ${totalAmount.toFixed(2)}</span></div>
            </td>
        </tr>
        </tbody>
        <tbody>
        <tr>
            <td colspan="10">
                <div class="overdue">
                    <h4 class="underline">Invoice Due</h4>
                    <p>Please pay invoice on or before <span class="due-date">${due_date}</span></p>
                </div>
            </td>
        </tr>
        </tbody>
    </table>


    <div class="water-mark"></div>

</div>

</body>
</html>`;
}

