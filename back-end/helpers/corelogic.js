
const corelogic = async (body,mlss) => {
    //return body;
    //console.log(body);
    var property_type = body.property_type;

    var max_date = body.max_date;
    var min_date = body.min_date;

    var max_price = body.max_price;
    var min_price = body.min_price;

    var max_square_footage = body.max_square_footage;
    var min_square_footage = body.min_square_footage;

    var max_year = body.max_year;
    var min_year = body.min_year;

    var sub_divisions = body.sub_divisions;

    var zip_code = body.zip_code;

    var dateSet = new Date();

    //console.log(property_type);

        /* if (api == 'Bridge') {

            dateSet.setFullYear(dateSet.getFullYear() - 1);

            var base = "$top=200&$filter=PropertyType eq 'Residential' and ";
            var dateYear = dateSet.getFullYear();
            //console.log("Year: "+ dateYear)
            var dateMonth = dateSet.getMonth();
            //console.log("Month: "+ dateMonth)
            if (dateMonth <= 9) {
                //console.log("Single Digit")
                dateMonth = "0" + dateMonth;
            } else {
                //console.log("Double Digit")
            }
            var dateDay = dateSet.getDate();
            if (dateDay <= 9) {
                //console.log("Single Digit")
                dateDay = "0" + dateDay;
            } else {
                //console.log("Double Digit")
            }
            //console.log("Day: " + dateDay)
            var dateNew = dateYear + "-" + dateMonth + "-" + dateDay;
        }
        else if (api == 'CoreLogic') { */
            var base = "$top=250&$expand=Media($select=MediaURL;$top=10;$orderby=Order)";
        /* }
        else {
            var base = "$top=250";
        } */

        //var base = "$top=250";
        var urlArr = [];
        //var url = "$top=250&";

        if (sub_divisions.length > 0) {
            var subStr = "";
            for (var i = 0; i < sub_divisions.length; i++) {
                subStr += "toupper(SubdivisionName) eq '" + sub_divisions[i].toUpperCase() + "'";
                if (i + 1 < sub_divisions.length) {
                    subStr += ' or ';
                };
            };
            urlArr.push("(" + subStr + ")");
        };


        if (property_type) {

            /* if (api == 'Bridge') {
                if (property_type == 'Single Family Detached') {
                    urlArr.push("(PropertySubType eq 'Single Family Residence')");
                }
                else {
                    urlArr.push("((PropertySubType eq 'Condominium') or (PropertySubType eq 'Townhouse'))");
                }
            }
            else if (api == 'CoreLogic') { */
                if (property_type == 'Single Family Detached') {
                    urlArr.push("startswith(PropertySubType, 'Detached') or startswith(PropertySubType, 'MobileHome')");
                }
                else {
                    urlArr.push("startswith(PropertySubType, 'Condominium')");
                }
            /* }
            else 
            {
                //urlArr.push("PropertySubType eq '" + property_type + "'");
                console.log(mlss.server_id);
                if(mlss.server_id == '15'){
                    
                    if (property_type === "Single Family Detached") {
                        urlArr.push("startswith(PropertySubType, 'Single Family Detached')"); // or startswith(PropertySubType, 'Mfg/Mobile Home')");
                        //console.log ("chart-new.js I am CCAR SFD.")
                        } else {
                        urlArr.push("startswith(PropertySubType, 'Single Family Attached')");
                        //console.log ("chart-new.js I am CCAR Condo.")
                        }
                    
                }
                else
                {
                    if (property_type === "Single Family Detached") {
                        urlArr.push("PropertyType eq 'Residential' and startswith(PropertySubType, 'Sngl. Fam.-Detached')");
                        //console.log("chart-new.js I am NEFMLS SFD.")
                    } else {
                        urlArr.push("PropertyType eq 'Residential' and (startswith(PropertySubType, 'Sngl. Fam.-Attached') or startswith(PropertySubType, 'Condominium'))");
                        //console.log("chart-new.js I am NEFMLS Attached.")
                    }
                }

            } */

        }

        // Adding zipCodes to URL
        if (zip_code.length > 0) {
            var subStr = "";
            for (var i = 0; i < zip_code.length; i++) {
                subStr += "(PostalCode eq '" + zip_code[i] + "')";
                if (i + 1 < zip_code.length) {
                    subStr += ' or ';
                };
            };
            urlArr.push("(" + subStr + ")");
        }

        if (min_year) {
            urlArr.push("YearBuilt ge " + min_year);
        };

        if (max_year) {
            urlArr.push("YearBuilt le " + max_year);
        };

        if (min_square_footage) {
            urlArr.push("LivingArea ge " + min_square_footage);
        };

        if (max_square_footage) {
            urlArr.push("LivingArea le " + max_square_footage);
        };

        if ((!min_square_footage)) {
            urlArr.push("LivingArea ge 1");
        }

        if (!min_price) {
            min_price = '10000';
        }

        if (!max_price) {
            max_price = '';
        }

        if (min_date) {

            dateSet = new Date(min_date);

            if (!min_price && !max_price) {

                /* if (api == 'Bridge') {
                    urlArr.push("(StandardStatus eq 'Active' or StandardStatus eq 'Pending') or (date(CloseDate) ge " + dateNew + " and StandardStatus eq 'Closed')");

                }
                else if (api == 'CoreLogic') { */
                    urlArr.push("(startswith(StandardStatus, 'Active') or startswith(StandardStatus, 'Pend') or startswith(StandardStatus, 'Cont') or startswith(StandardStatus, 'First') or startswith(StandardStatus, 'Option')) or (date(CloseDate) ge '" + dateSet.toISOString() + "' and (startswith(StandardStatus, 'Sold') or startswith(StandardStatus, 'Leased')))");

                /* }
                else {
                    urlArr.push("(startswith(StandardStatus, 'Active') or startswith(StandardStatus, 'Pend') or startswith(StandardStatus, 'Option')) or (date(CloseDate) ge '" + dateSet.toISOString() + "' and startswith(StandardStatus, 'Sold'))");

                } */
            }

        }

        if (min_price) {

            if (max_price) {

                /* if (api == 'Bridge') {
                    urlArr.push("(StandardStatus eq 'Active' and (ListPrice ge " + min_price + " and ListPrice le " + max_price + ")) or (StandardStatus eq 'Pending' and (ListPrice ge " + min_price + " and ListPrice le " + max_price + ")) or (date(CloseDate) ge " + dateNew + " and (StandardStatus eq 'Closed' and (ClosePrice ge " + min_price + " and ClosePrice le " + max_price + ")))")

                }
                else if (api == 'CoreLogic') { */
                    urlArr.push("(startswith(StandardStatus,'Active') and (ListPrice ge " + min_price + " and ListPrice le " + max_price + ")) or ((startswith(StandardStatus, 'Pend') or startswith(StandardStatus, 'Cont') or startswith(StandardStatus, 'First')) and (ListPrice ge " + min_price + " and ListPrice le " + max_price + ")) or (startswith(StandardStatus,'Option') and (ListPrice ge " + min_price + " and ListPrice le " + max_price + ")) or (date(CloseDate) ge '" + dateSet.toISOString() + "' and ((startswith(StandardStatus, 'Sold') or startswith(StandardStatus, 'Leased')) and (ClosePrice ge " + min_price + " and ClosePrice le " + max_price + ")))");

                /* }
                else {
                    urlArr.push("(startswith(StandardStatus,'Active') and (ListPrice ge " + min_price + " and ListPrice le " + max_price + ")) or (startswith(StandardStatus,'Pending') and (ListPrice ge " + min_price + " and ListPrice le " + max_price + ")) or (startswith(StandardStatus,'Option') and (ListPrice ge " + min_price + " and ListPrice le " + max_price + ")) or (date(CloseDate) ge '" + dateSet.toISOString() + "' and (startswith(StandardStatus, 'Sold') and (ClosePrice ge " + min_price + " and ClosePrice le " + max_price + ")))");

                } */
            }
            else {
                /* if (api == 'Bridge') {
                    urlArr.push("(StandardStatus eq 'Active' and (ListPrice ge " + min_price + ")) or (StandardStatus eq 'Pending' and (ListPrice ge " + min_price + ")) or (date(CloseDate) ge " + dateNew + " and (StandardStatus eq 'Closed' and (ClosePrice ge " + min_price + ")))")

                }
                else if (api == 'CoreLogic') { */
                    urlArr.push("(startswith(StandardStatus,'Active') and (ListPrice ge " + min_price + ")) or ((startswith(StandardStatus, 'Pend') or startswith(StandardStatus, 'Cont') or startswith(StandardStatus, 'First')) and (ListPrice ge " + min_price + ")) or (startswith(StandardStatus,'Option') and (ListPrice ge " + min_price + ")) or (date(CloseDate) ge '" + dateSet.toISOString() + "' and ((startswith(StandardStatus, 'Sold') or startswith(StandardStatus, 'Leased')) and ClosePrice ge " + min_price + "))");

                /* }
                else {
                    urlArr.push("(startswith(StandardStatus,'Active') and (ListPrice ge " + min_price + ")) or (startswith(StandardStatus,'Pending') and (ListPrice ge " + min_price + ")) or (startswith(StandardStatus,'Option') and (ListPrice ge " + min_price + ")) or (date(CloseDate) ge '" + dateSet.toISOString() + "' and (startswith(StandardStatus, 'Sold') and ClosePrice ge " + min_price + "))");

                } */
            }

        }

        if (max_price && !min_price) {

           /* if (api == 'Bridge') {
                urlArr.push("(StandardStatus eq 'Active' and (ListPrice le " + max_price + ")) or (StandardStatus eq 'Pending' and (ListPrice le " + max_price + ")) or (date(CloseDate) ge " + dateNew + " and (StandardStatus eq 'Closed' and (ClosePrice le " + max_price + ")))")
            }
            else if (api == 'CoreLogic') { */
                urlArr.push("(startswith(StandardStatus,'Active') and (ListPrice le " + max_price + ")) or ((startswith(StandardStatus, 'Pend') or startswith(StandardStatus, 'Cont') or startswith(StandardStatus, 'First')) and (ListPrice le " + max_price + ")) or (startswith(StandardStatus,'Option') and (ListPrice le " + max_price + ")) or (date(CloseDate) ge '" + dateSet.toISOString() + "' and ((startswith(StandardStatus, 'Sold') or startswith(StandardStatus, 'Leased')) and ClosePrice le " + max_price + "))");
            /* }
            else {
                urlArr.push("(startswith(StandardStatus,'Active') and (ListPrice le " + max_price + ")) or (startswith(StandardStatus,'Pending') and (ListPrice le " + max_price + ")) or (startswith(StandardStatus,'Option') and (ListPrice le " + max_price + ")) or (date(CloseDate) ge '" + dateSet.toISOString() + "' and (startswith(StandardStatus, 'Sold') and ClosePrice le " + max_price + "))");

            } */

        }

        if (min_price === '10000') {
            min_price = "";
        }

        if (urlArr.length > 0) {

            //if (api == 'retsrabbit') {
                //console.log(mls.server_id);
                //base += "&$filter=server_id eq " + mlss.server_id + " and ";
            //}

            //if (api == "CoreLogic") {
                base += "&PropertyType eq 'Residential' and ";
            //}

            for (var i = 0; i < urlArr.length; i++) {
                base += urlArr[i];
                if (i + 1 < urlArr.length) {
                    base += " and ";
                };
            };
        }

        return (base);

    
};

exports.corelogic = corelogic;

