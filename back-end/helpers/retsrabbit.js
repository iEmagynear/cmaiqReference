const retsrabbits = async (body, mlss) => {
  //console.log(body);
  //console.log("Body Data: " + body);
  //console.log("MLS Server ID: " + mlss.server_id);

  var isOutAPC = body.isOutAPC;
  var property_type = body.property_type;
  var pcbor_prop_type = body.pcbor_prop_type;
  var wildcardCheckPass = body.wildcardCheckPass;

  var max_date = body.max_date;
  var min_date = body.min_date;

  var max_price = body.max_price;
  var min_price = body.min_price;

  var max_square_footage = body.max_square_footage;
  var min_square_footage = body.min_square_footage;

  var max_year = body.max_year;
  var min_year = body.min_year;

  var sub_divisions = body.sub_divisions;
  var area = body.area;

  var zip_code = body.zip_code;
  var wf = body.waterfront;
  var pool = body.private_pool;
  var hopa = body.hopa;
  var hoa = body.hoa;
  var folionumber = body.folionumber;

  var listing_type =
    body.listing_type == "null" ||
    body.listing_type == null ||
    body.listing_type == undefined
      ? null
      : "'" + body.listing_type + "'";

  if (body.furnished != "") {
    if (body.furnished == "No") {
      var furnished = "((Furnished eq 'Unfurnished') or (Furnished eq null))";
    }
    if (body.furnished == "Yes") {
      var furnished =
        "((Furnished eq 'Furnished') or (Furnished eq 'Partially'))";
    }
  } else {
    var furnished =
      "((Furnished eq 'Unfurnished') or (Furnished eq null) or (Furnished eq 'Furnished') or (Furnished eq 'Partially'))";
  }

  //console.log("IsOutAPC? - " + isOutAPC);

  if (isOutAPC === false) {
    console.log("Normal");
    var dateSet = new Date();

    var base = "$top=250";

    var selectArr = [
      "ListingKey",
      "ListingId",
      "StandardStatus",
      "ListingContractDate",
      "CloseDate",
      "OnMarketDate",
      "PendingTimestamp",
      "ContractStatusChangeDate",
      "OffMarketDate",
      "ModificationTimestamp",
      "StatusChangeTimestamp",
      "PriceChangeTimestamp",
      "OriginalEntryTimestamp",
      "DaysOnMarket",
      "CumulativeDaysOnMarket",
      "ClosePrice",
      "ListPrice",
      "StreetNumber",
      "StreetNumberNumeric",
      "StreetDirPrefix",
      "StreetName",
      "StreetSuffix",
      "StreetDirSuffix",
      "UnitNumber",
      "City",
      "StateOrProvince",
      "Country",
      "PostalCode",
      "CountyOrParish",
      "MLSAreaMajor",
      "Township",
      "SubdivisionName",
      "Latitude",
      "Longitude",
      "PropertyType",
      "PropertySubType",
      "BedroomsTotal",
      "BathroomsTotalInteger",
      "BathroomsFull",
      "BathroomsHalf",
      "LivingArea",
      "YearBuilt",
      "ParcelNumber",
      "BuildingAreaTotal",
      "ArchitecturalStyle",
      "BathroomsTotalDecimal",
      "PoolFeatures",
      "PoolPrivateYN",
      "WaterfrontYN",
      "WaterBodyName",
      "WaterfrontFeatures",
      "LotFeatures",
      "SeniorCommunityYN",
      "AssociationYN",
      "CommunityFeatures",
      "AssociationName",
      "PublicSurveyRange",
      "MajorChangeTimestamp",
      "OnMarketTimestamp",
      "OffMarketTimestamp",
      "OriginalListPrice",
      "PhotosCount",
      "PhotosChangeTimestamp",
      "ListingTerms",
      "SpecialListingConditions",
      "StreetSuffixModifier",
      "MLSAreaMinor",
      "ElementarySchool",
      "ElementarySchoolDistrict",
      "MiddleOrJuniorSchool",
      "MiddleOrJuniorSchoolDistrict",
      "HighSchool",
      "HighSchoolDistrict",
      "AssociationFee",
      "AssociationFeeIncludes",
      "AssociationAmenities",
      "PetsAllowed",
      "View",
      "ViewYN",
      "InteriorFeatures",
      "ExteriorFeatures",
      "Furnished",
      "BathroomsPartial",
      "photos",
    ];

    // Selected Specific Valued Constructed
    base += "&$select=";

    for (var i = 0; i < selectArr.length; i++) {
      if (i === selectArr.length - 1) {
        //console.log(" Not Ok")
        base += selectArr[i];
      } else {
        //console.log("Ok")
        base += selectArr[i] + ",";
      }
    }

    var urlArr = [];
    //-- Subdivision & Alt. Check START --//

    //METRO
    if (mlss.server_id == "62") {
      if (wildcardCheckPass === true) {
        if (sub_divisions.length > 0) {
          var subStr = "";
          for (var i = 0; i < sub_divisions.length; i++) {
            subStr +=
              "startswith(ElementarySchoolDistrict, '" +
              sub_divisions[i].toUpperCase() +
              "')";
            if (i + 1 < sub_divisions.length) {
              subStr += " or ";
            }
          }
          urlArr.push("(" + subStr + ")");
        }
      } else {
        if (sub_divisions.length > 0) {
          var subStr = "";
          for (var i = 0; i < sub_divisions.length; i++) {
            subStr +=
              "toupper(ElementarySchoolDistrict) eq '" +
              sub_divisions[i].toUpperCase() +
              "'";
            if (i + 1 < sub_divisions.length) {
              subStr += " or ";
            }
          }
          urlArr.push("(" + subStr + ")");
        }
      }
    }
    //STELLAR
    else if (mlss.server_id == "76" || mlss.server_id == "RGM") {
      if (sub_divisions.length > 0) {
        var subStr = "";
        for (var i = 0; i < sub_divisions.length; i++) {
          subStr += "MLSAreaMajor eq '" + sub_divisions[i] + "'";
          if (i + 1 < sub_divisions.length) {
            subStr += " or ";
          }
        }
        urlArr.push("(" + subStr + ")");
      }
    }
    //PCBOR
    else if (mlss.server_id == "11") {
      if (area) {
        var areaStr = "";
        areaStr += "MLSAreaMajor eq '" + area + "'";
        urlArr.push("(" + areaStr + ")");
      }
      if (sub_divisions.length > 0) {
        var subStr = "";
        for (var i = 0; i < sub_divisions.length; i++) {
          subStr +=
            "toupper(SubdivisionName) eq '" +
            sub_divisions[i].toUpperCase() +
            "'";
          if (i + 1 < sub_divisions.length) {
            subStr += " or ";
          }
        }
        urlArr.push("(" + subStr + ")");
      }
    } else {
      if (sub_divisions.length > 0) {
        if (wildcardCheckPass === true) {
          var subStr = "";
          for (var i = 0; i < sub_divisions.length; i++) {
            subStr +=
              "startswith(SubdivisionName, '" +
              sub_divisions[i].toUpperCase() +
              "')";
            if (i + 1 < sub_divisions.length) {
              subStr += " or ";
            }
          }
          urlArr.push("(" + subStr + ")");
        } else {
          var subStr = "";
          for (var i = 0; i < sub_divisions.length; i++) {
            subStr +=
              "toupper(SubdivisionName) eq '" +
              sub_divisions[i].toUpperCase() +
              "'";
            if (i + 1 < sub_divisions.length) {
              subStr += " or ";
            }
          }
          urlArr.push("(" + subStr + ")");
        }
      }
    }

    /**
     * Miami custom fields
     */
    if (mlss.server_id == "63") {
      if (wf) {
        if (wf === "yes") {
          urlArr.push("(WaterfrontYN eq 'true')");
        } else if (wf === "no") {
          urlArr.push("((WaterfrontYN eq 'false') or (WaterfrontYN eq null))");
        }
      }

      if (pool) {
        if (pool === "yes") {
          urlArr.push(
            "((PoolPrivateYN eq 'true') or ((contains(PoolFeatures, 'In Ground')) or (contains(PoolFeatures, 'Above Ground'))))"
          );
        } else if (pool === "no") {
          urlArr.push("(((PoolPrivateYN eq null) and (PoolFeatures eq '')))");
        }
      }

      if (hopa) {
        if (hopa === "yes") {
          urlArr.push("(SeniorCommunityYN eq 'true')");
        } else if (hopa === "no") {
          urlArr.push(
            "((SeniorCommunityYN eq 'false') or (SeniorCommunityYN eq null))"
          );
        }
      }

      if (hoa) {
        if (hoa === "yes") {
          urlArr.push("(AssociationYN eq 'true')");
        } else if (hoa === "no") {
          urlArr.push(
            "((AssociationYN eq 'false') or (AssociationYN eq null))"
          );
        }
      }

      if (folionumber) {
        console.log("folionumber====== ", folionumber);
        // var folioNum = (folionumber) => {
        var newKey = "";
        var returnVal = "";
        var count = null;
        if (folionumber.includes("-") === true) {
          //console.log("Found Dashes")
          count = (folionumber.match(/-/g) || []).length;
          for (var x = 0; x < count; x++) {
            //console.log("Go")
            folionumber = folionumber.replace("-", "");
            newKey = folionumber;
          }
          //console.log("New Key: " + newKey)
        } else {
          //console.log("Nothing Found")
          newKey = folionumber;
        }
        var folioString = "";
        var countyVal = newKey.substring(0, 2);
        var firstVal = newKey.substring(2, 4);
        var secondVal = newKey.substring(4, 6);
        var thirdVal = newKey.substring(6, 9);
        var zeroVal = newKey.substring(9, 13);
        var countyValCheck = parseInt(countyVal);

        if (countyValCheck <= 36 && countyValCheck >= 1) {
          console.log("Miami-Dade County (DASHES)");
          if (zeroVal.length != 0) {
            folioString =
              countyVal +
              "-" +
              firstVal +
              "-" +
              secondVal +
              "-" +
              thirdVal +
              "-" +
              zeroVal;
          } else if (thirdVal.length != 0) {
            folioString =
              countyVal + "-" + firstVal + "-" + secondVal + "-" + thirdVal;
          } else if (secondVal.length != 0) {
            folioString = countyVal + "-" + firstVal + "-" + secondVal;
          } else if (firstVal.length != 0) {
            folioString = countyVal + "-" + firstVal;
          } else {
            folioString = countyVal;
          }

          returnVal =
            "((CountyOrParish eq 'Miami-Dade County') and (startswith(ParcelNumber, '" +
            folioString +
            "')))";
        } else if (countyValCheck <= 51 && countyValCheck >= 47) {
          console.log("Broward County (NO DASHES)");
          //folioString = "(CountyOrParish eq 'Broward County')";
          if (zeroVal.length != 0) {
            folioString = countyVal + firstVal + secondVal + thirdVal + zeroVal;
          } else if (thirdVal.length != 0) {
            folioString = countyVal + firstVal + secondVal + thirdVal;
          } else if (secondVal.length != 0) {
            folioString = countyVal + firstVal + secondVal;
          } else if (firstVal.length != 0) {
            folioString = countyVal + firstVal;
          } else {
            folioString = countyVal;
          }
          //console.log("Completed String: " + folioString);
          returnVal =
            "((CountyOrParish eq 'Broward County') and (startswith(ParcelNumber, '" +
            folioString +
            "')))";
        } else {
          //console.log("Irrelevant")
          if (zeroVal.length != 0) {
            folioString = countyVal + firstVal + secondVal + thirdVal + zeroVal;
          } else if (thirdVal.length != 0) {
            folioString = countyVal + firstVal + secondVal + thirdVal;
          } else if (secondVal.length != 0) {
            folioString = countyVal + firstVal + secondVal;
          } else if (firstVal.length != 0) {
            folioString = countyVal + firstVal;
          } else {
            folioString = countyVal;
          }
          returnVal = "(startswith(ParcelNumber, '" + folioString + "'))";
        }
        // return returnVal;
        // }
        // console.log(returnVal);
        urlArr.push(returnVal);
      }
    }

    /**
     * RAPB + GFLR custom fields
     */

    if (mlss.server_id == "RGM") {
      if (wf) {
        if (wf === "yes") {
          urlArr.push(
            "((WaterfrontFeatures eq 'Yes') or (WaterfrontYN eq 'true'))"
          );
        } else if (wf === "no") {
          urlArr.push(
            "((WaterfrontFeatures eq 'No') or (WaterfrontYN eq 'false') or ((WaterfrontFeatures eq null) and (WaterfrontYN eq null)))"
          );
        }
      }

      if (pool) {
        if (pool === "yes") {
          urlArr.push("((PoolFeatures eq 'Yes') or (PoolPrivateYN eq 'true'))");
        } else if (pool === "no") {
          urlArr.push(
            "((PoolFeatures eq 'No') or (PoolPrivateYN eq 'false') or ((PoolFeatures eq null) and (PoolPrivateYN eq null)))"
          );
        }
      }

      if (hopa) {
        if (hopa === "yes") {
          urlArr.push(
            "(((CommunityFeatures eq 'Yes-Verified') or (startswith(CommunityFeatures, 'V')) or (CommunityFeatures eq 'Yes-Unverified') or (startswith(CommunityFeatures, 'U'))) and (CommunityFeatures ne null))"
          );
        } else if (hopa === "no") {
          urlArr.push(
            "((CommunityFeatures eq 'No Hopa') or (CommunityFeatures eq 'No HOPA') or (CommunityFeatures eq null) or (CommunityFeatures eq ''))"
          );
        }
      }

      if (hoa) {
        if (hoa === "yes") {
          urlArr.push(
            "(((AssociationName eq 'Condo') or (AssociationName eq 'Homeowners') or (AssociationName eq 'Mandatory')) and (AssociationName ne null))"
          );
        } else if (hoa === "no") {
          urlArr.push(
            "((AssociationName eq 'Other') or (AssociationName eq 'None') or (AssociationName eq null) or (AssociationName eq 'Voluntary') or (AssociationName eq ''))"
          );
        }
      }

      if (folionumber) {
        console.log("folionumber====== ", folionumber);
        // var folioNum = (folionumber) => {
        var newKey = "";
        var returnVal = "";
        var count = null;
        if (folionumber.includes("-") === true) {
          //console.log("Found Dashes")
          count = (folionumber.match(/-/g) || []).length;
          for (var x = 0; x < count; x++) {
            //console.log("Go")
            folionumber = folionumber.replace("-", "");
            newKey = folionumber;
          }
          //console.log("New Key: " + newKey)
        } else {
          //console.log("Nothing Found")
          newKey = folionumber;
        }
        var folioString = "";
        var countyVal = newKey.substring(0, 2);
        var firstVal = newKey.substring(2, 4);
        var secondVal = newKey.substring(4, 6);
        var thirdVal = newKey.substring(6, 9);
        var zeroVal = newKey.substring(9, 13);
        var countyValCheck = parseInt(countyVal);

        if (countyValCheck <= 36 && countyValCheck >= 1) {
          console.log("Miami-Dade County (DASHES)");
          if (zeroVal.length != 0) {
            folioString =
              countyVal +
              "-" +
              firstVal +
              "-" +
              secondVal +
              "-" +
              thirdVal +
              "-" +
              zeroVal;
          } else if (thirdVal.length != 0) {
            folioString =
              countyVal + "-" + firstVal + "-" + secondVal + "-" + thirdVal;
          } else if (secondVal.length != 0) {
            folioString = countyVal + "-" + firstVal + "-" + secondVal;
          } else if (firstVal.length != 0) {
            folioString = countyVal + "-" + firstVal;
          } else {
            folioString = countyVal;
          }

          returnVal =
            "((CountyOrParish eq 'Miami-Dade County') and (startswith(ParcelNumber, '" +
            folioString +
            "')))";
        } else if (countyValCheck <= 51 && countyValCheck >= 47) {
          console.log("Broward County (NO DASHES)");
          //folioString = "(CountyOrParish eq 'Broward County')";
          if (zeroVal.length != 0) {
            folioString = countyVal + firstVal + secondVal + thirdVal + zeroVal;
          } else if (thirdVal.length != 0) {
            folioString = countyVal + firstVal + secondVal + thirdVal;
          } else if (secondVal.length != 0) {
            folioString = countyVal + firstVal + secondVal;
          } else if (firstVal.length != 0) {
            folioString = countyVal + firstVal;
          } else {
            folioString = countyVal;
          }
          //console.log("Completed String: " + folioString);
          returnVal =
            "((CountyOrParish eq 'Broward County') and (startswith(ParcelNumber, '" +
            folioString +
            "')))";
        } else {
          //console.log("Irrelevant")
          if (zeroVal.length != 0) {
            folioString = countyVal + firstVal + secondVal + thirdVal + zeroVal;
          } else if (thirdVal.length != 0) {
            folioString = countyVal + firstVal + secondVal + thirdVal;
          } else if (secondVal.length != 0) {
            folioString = countyVal + firstVal + secondVal;
          } else if (firstVal.length != 0) {
            folioString = countyVal + firstVal;
          } else {
            folioString = countyVal;
          }
          returnVal = "(startswith(ParcelNumber, '" + folioString + "'))";
        }
        // return returnVal;
        // }
        // console.log(returnVal);
        urlArr.push(returnVal);
      }
    }

    //-- Subdivision & Alt. Check END --//

    //-- PropertyType Check START --//

    if (property_type) {
      //CTAR
      if (mlss.server_id == "15") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Single Family Detached')"); // or startswith(PropertySubType, 'Mfg/Mobile Home')");
          //console.log ("I am CTAR SFD.")
        } else {
          urlArr.push("startswith(PropertySubType, 'Single Family Attached')");
          //console.log ("I am CTAR SFA.")
        }
      }
      //GGAR
      else if (mlss.server_id == "38") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Single Family-Detached')");
          //console.log("I am GGAR SFD.")
        } else {
          urlArr.push(
            "startswith(PropertySubType, 'Condo/Townhouse-Attached')"
          );
          //console.log("I am GGAR SFA.")
        }
      }
      //TMLS
      else if (mlss.server_id == "39") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Detached')");
          //console.log("I am TMLS SFD.")
        } else {
          urlArr.push("startswith(PropertySubType, 'Attached')");
          //console.log("I am TMLS SFA.")
        }
      }
      //COLA
      else if (mlss.server_id == "77") {
        if (property_type === "Single Family Detached") {
          urlArr.push("PropertyType eq 'Single Family'");
          //console.log("I am COLA SFD.")
        } else {
          urlArr.push(
            "((PropertyType eq 'Patio') or (PropertyType eq 'Condo'))"
          );
          //console.log("I am COLA SFA.")
        }
      }
      //ABOR
      else if (mlss.server_id == "46") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'House')");
          //console.log("I am ABOR SFD.")
        } else {
          urlArr.push("startswith(PropertySubType, 'Condo')");
          //console.log("I am ABOR SFA.")
        }
      }
      //HAR
      else if (mlss.server_id == "47") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertyType, 'Single-Family')");
          //console.log("I am HAR SFD.")
        } else {
          urlArr.push("startswith(PropertyType, 'Townhouse/Condo')");
          //console.log("I am HAR SFA.")
        }
      }
      //CanopyMLS
      else if (mlss.server_id == "54") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Single')");
          //console.log("I am HAR SFD.")
        } else {
          urlArr.push(
            "startswith(PropertySubType, 'Condo') or startswith(PropertySubType, 'Town')"
          );
          //console.log("I am HAR SFA.")
        }
      }
      //FMLS
      else if (mlss.server_id == "55") {
        if (property_type === "Single Family Detached") {
          urlArr.push(
            "PropertyType eq 'Residential' and startswith(PropertySubType, 'Single Family Residence')"
          );
          //console.log("I am HAR SFD.")
        } else {
          urlArr.push(
            "PropertyType eq 'Residential' and (startswith(PropertySubType, 'Townhouse') or startswith(PropertySubType, 'Condominium'))"
          );
          //console.log("I am HAR SFA.")
        }
      }
      //GAMLS
      else if (mlss.server_id == "35") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertyType, 'Single Family Detached')");
          //console.log("I am HAR SFD.")
        } else {
          urlArr.push("startswith(PropertyType, 'Single Family Attached')");
          //console.log("I am HAR SFA.")
        }
      }
      //NEFMLS
      else if (mlss.server_id == "56") {
        if (property_type === "Single Family Detached") {
          urlArr.push("(PropertyType eq 'Single Family Residence')");
          //console.log("I am NEFMLS SFD.")
        } else {
          urlArr.push(
            "(PropertyType eq 'Townhouse' or PropertyType eq 'Condominium')"
          );
          //console.log("I am NEFMLS SFA.")
        }
      }
      //SABOR
      else if (mlss.server_id == "49") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Single Family Detached')");
          //console.log("I am SABOR SFD.")
        } else {
          urlArr.push(
            "startswith(PropertySubType, 'Garden/Patio Home/Detchd')"
          );
          //console.log("I am SABOR SFA.")
        }
      }
      //METRO
      else if (mlss.server_id == "62") {
        if (property_type === "Single Family Detached") {
          urlArr.push("PropertyType eq 'A'");
          //console.log("I am METRO SFD.")
        } else {
          urlArr.push("PropertyType eq 'F'");
          //console.log("I am METRO SFA.")
        }
      }
      //NTREIS
      else if (mlss.server_id == "1") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'RES-Single Family')");
          //console.log("I am NTREIS SFD.")
        } else {
          urlArr.push("startswith(PropertySubType, 'RES-Condo')");
          //console.log("I am NTREIS SFA.")
        }
      }
      //STELLAR
      else if (mlss.server_id == "76") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Single Family Residence')");
          //console.log("I am STELLAR SFD.")
        } else {
          urlArr.push(
            "(startswith(PropertySubType, 'Condominium') or startswith(PropertySubType, 'Villa') or startswith(PropertySubType, '1/2 Duplex') or startswith(PropertySubType, 'Condo - Hotel') or startswith(PropertySubType, 'Townhouse'))"
          );
          //console.log("I am STELLAR SFA.")
        }
      }
      //NWMLS
      else if (mlss.server_id == "40") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertyType, 'RESI')");
          //console.log("I am NWMLS SFD.")
        } else {
          urlArr.push("startswith(PropertyType, 'COND')");
          //console.log("I am NWMLS SFA.")
        }
      }
      //BEACHES
      else if (mlss.server_id == "RGM") {
        if (property_type === "Single Family Detached") {
          urlArr.push(
            "((PropertyType eq 'A' and startswith(PropertySubType, 'Single Family Detached') or startswith(PropertySubType, 'M')) or (startswith(PropertySubType, 'Single Family')))"
          );
          //console.log("I am BEACHES SFD.")
        } else {
          urlArr.push(
            "((PropertyType eq 'A' and startswith(PropertySubType, 'C') or startswith(PropertySubType, 'V') or startswith(PropertySubType, 'Townhouse')) or (startswith(PropertySubType,'Condo/Co-Op/Villa/Townhouse')))"
          );
          //console.log("I am BEACHES SFA.")
        }
      }
      //MIAMI
      else if (mlss.server_id == "63") {
        if (property_type === "Single Family Detached") {
          urlArr.push("(PropertySubType eq 'Single Family Residence')");
          //console.log("I am MIAMI SFD.")
        } else {
          urlArr.push(
            "((PropertySubType eq 'Condominium') or (PropertySubType eq 'Townhouse'))"
          );
          //console.log("I am MIAMI SFA.")
        }
      }
      //CINCY
      else if (mlss.server_id == "53") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Single Family Residence')");
          //console.log("I am CINCY SFD.")
        } else {
          urlArr.push("startswith(PropertySubType, 'Condominium')");
          //console.log("I am CINCY SFA.")
        }
        //CCAR
      } else if (mlss.server_id == "65") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Detached')");
          //console.log("I am CCAR SFD.")
        } else {
          urlArr.push(
            "(startswith(PropertySubType, 'Townhouse') or startswith(PropertySubType, 'Condominium'))"
          );
          //console.log("I am CCAR SFA.")
        }
        //MIBOR
      } else if (mlss.server_id == "60") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Single Family')");
          //console.log("I am MIBOR SFD.")
        } else {
          urlArr.push("(startswith(PropertySubType, 'Condominium'))");
          //console.log("I am MIBOR SFA.")
        }
        //MARIS
      } else if (mlss.server_id == "70") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Single Family')");
          //console.log("I am MIBOR SFD.")
        } else {
          urlArr.push("startswith(PropertySubType, 'Condominium')");
          //console.log("I am MIBOR SFA.")
        }
        //IMLS
      } else if (mlss.server_id == "2") {
        if (property_type === "Single Family Detached") {
          urlArr.push(
            "(startswith(PropertySubType, 'Single Family w/ Acreage') or startswith(PropertySubType, 'Single Family') or startswith(PropertySubType, 'Recreational Land w/ Home'))"
          );
          //console.log("I am IMLS SFD.")
        } else {
          urlArr.push(
            "(startswith(PropertySubType, 'Townhouse') or startswith(PropertySubType, 'Condo'))"
          );
          //console.log("I am IMLS SFA.")
        }
        //PCBOR
      } else if (mlss.server_id == "11") {
        if (property_type === "Single Family Detached") {
          urlArr.push("startswith(PropertySubType, 'Detached')");
          //console.log("I am IMLS SFD.")
        } else {
          if (pcbor_prop_type === "Townhouse") {
            urlArr.push("(startswith(PropertySubType, 'Townhouse'))");
          } else if (pcbor_prop_type === "Stacked/Multi-Level") {
            urlArr.push("(startswith(PropertySubType, 'Stacked/Multi-Level'))");
          } else {
            urlArr.push(
              "(startswith(PropertySubType, 'Townhouse') or startswith(PropertySubType, 'Stacked/Multi-Level'))"
            );
          }
          //console.log("I am IMLS SFA.")
        }
      }
      //CJMLS
      else if (mlss.server_id == "58") {
        if (property_type === "Single Family Detached") {
          urlArr.push(
            "((PropertySubType eq 'Single Family Residence') or (PropertySubType eq 'Mobile Home'))"
          );
          //console.log("I am MIAMI SFD.")
        } else {
          urlArr.push(
            "((PropertySubType eq 'Condo/TH') or (PropertySubType eq 'Townhouse') or (PropertySubType eq 'Stock Cooperative'))"
          );
          //console.log("I am MIAMI SFA.")
        }
      }

      //Spartanburg
      else if (mlss.server_id == "14") {
        if (property_type === "Single Family Detached") {
          urlArr.push("(PropertyType eq 'Single Family')");
          //console.log("I am MIAMI SFD.")
        } else {
          urlArr.push(
            "((PropertyType eq 'Townhouse') or (PropertyType eq 'Condo'))"
          );
          //console.log("I am MIAMI SFA.")
        }
      }

      //TriadMLS
      else if (mlss.server_id == "8") {
        if (property_type === "Single Family Detached") {
          urlArr.push(
            "((PropertySubType eq 'Single Family Residence') or (PropertySubType eq 'Stick/Site Built'))"
          );
          //console.log("I am MIAMI SFD.")
        } else {
          urlArr.push(
            "((PropertySubType eq 'Condominium') or (PropertySubType eq 'Townhouse'))"
          );
          //console.log("I am MIAMI SFA.")
        }
      }
    }

    //-- PropertyType Check END --//

    // Adding zipCodes to URL
    if (zip_code.length > 0) {
      var subStr = "";
      for (var i = 0; i < zip_code.length; i++) {
        subStr += "(contains(PostalCode, '" + zip_code[i] + "'))";
        if (i + 1 < zip_code.length) {
          subStr += " or ";
        }
      }
      urlArr.push("(" + subStr + ")");
    }

    if (min_year) {
      urlArr.push("YearBuilt ge " + min_year);
    }

    if (max_year) {
      urlArr.push("YearBuilt le " + max_year);
    }

    if (min_square_footage) {
      if (mlss.server_id == "65") {
        urlArr.push(
          "((BuildingAreaTotal ge " +
            min_square_footage +
            ") or (LivingArea ge " +
            min_square_footage +
            "))"
        );
      } else {
        urlArr.push("LivingArea ge " + min_square_footage);
      }
    }

    if (max_square_footage) {
      if (mlss.server_id == "65") {
        urlArr.push(
          "((BuildingAreaTotal le " +
            max_square_footage +
            ") or (LivingArea le " +
            max_square_footage +
            "))"
        );
      } else {
        urlArr.push("LivingArea le " + max_square_footage);
      }
    }

    if (!min_square_footage) {
      if (mlss.server_id == "65") {
        urlArr.push("((BuildingAreaTotal ge 1) or (LivingArea ge 1))");
      } else if (listing_type === "'Rental'") {
        urlArr.push("LivingArea ge 100");
      } else {
        urlArr.push("LivingArea ge 1");
      }
    }

    //-- Pricing Checks START --//

    if (!min_price) {
      if (listing_type === "'Rental'") {
        min_price = "100";
      } else {
        min_price = "10000";
      }
    }

    if (!max_price) {
      max_price = "";
    }

    if (min_date) {
      dateSet = new Date(min_date);

      if (!min_price && !max_price) {
        //CTAR - No Max and Min
        if (mlss.server_id == "15") {
          console.log("CTAR No Max and Min");
          urlArr.push(
            "(StandardStatus eq 'Active' or StandardStatus eq 'Active Contingent' or StandardStatus eq 'Pending' or StandardStatus eq 'Application Approved' or StandardStatus eq 'Application Submitted') or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (StandardStatus eq 'Closed' or StandardStatus eq 'Rented'))"
          );
        }
        //TMLS - No Max and Min
        else if (
          mlss.server_id == "39" ||
          mlss.server_id == "77" ||
          mlss.server_id == "55" ||
          mlss.server_id == "65"
        ) {
          console.log("TMLS/COLA/FMLS/IMLS No Max and Min");
          urlArr.push(
            "(startswith(StandardStatus, 'Active') or startswith(StandardStatus, 'Pend') or (StandardStatus eq 'Coming Soon')) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and startswith(StandardStatus, 'Closed'))"
          );
        }
        //ABOR - No Max and Min
        else if (
          mlss.server_id == "46" ||
          mlss.server_id == "47" ||
          mlss.server_id == "35" ||
          mlss.server_id == "38" ||
          mlss.server_id == "56" ||
          mlss.server_id == "49" ||
          mlss.server_id == "62" ||
          mlss.server_id == "60" ||
          mlss.server_id == "2" ||
          mlss.server_id == "14" ||
          mlss.server_id == "8"
        ) {
          console.log("ABOR/HAR/GAMLS/GGAR/NEFMLS/SABOR/METRO No Max and Min");
          urlArr.push(
            "(startswith(StandardStatus, 'Active') or startswith(StandardStatus, 'Pend') or startswith(StandardStatus, 'Cont') or startswith(StandardStatus, 'First') or startswith(StandardStatus, 'Option')) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (startswith(StandardStatus, 'Sold') or startswith(StandardStatus, 'Closed') or startswith(StandardStatus, 'Rental Leased') ))"
          );
        }
        //CMLS - No Max and Min
        else if (mlss.server_id == "54") {
          console.log("CMLS No Max and Min");
          urlArr.push(
            "(startswith(StandardStatus, 'Active') or startswith(StandardStatus, 'Under')) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and startswith(StandardStatus, 'Closed'))"
          );
        }
        //NTREIS - No Max and Min
        else if (
          mlss.server_id == "1" ||
          mlss.server_id == "76" ||
          mlss.server_id == "40" ||
          mlss.server_id == "53"
        ) {
          console.log("NTREIS/STELLAR/NWMLS/CINCY No Max and Min");
          urlArr.push(
            "(startswith(StandardStatus, 'A') or startswith(StandardStatus, 'P')) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (startswith(StandardStatus, 'S') or startswith(StandardStatus, 'C')))"
          );
        }
        //BEACHES - No Max and Min
        else if (mlss.server_id == "RGM") {
          console.log("BEACHES No Max and Min");
          urlArr.push(
            "(startswith(StandardStatus, 'Active') or startswith(StandardStatus, 'Pend') or startswith(StandardStatus, 'Under')) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (startswith(StandardStatus, 'Closed') or startswith(StandardStatus, 'Rented')))"
          );
        }
        //MIAMI/CHMLS - No Max and Min
        else if (mlss.server_id == "63" || mlss.server_id == "58") {
          console.log("MIAMI No Max and Min");
          urlArr.push(
            "(startswith(StandardStatus,'Active') or StandardStatus eq 'Pending') or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and StandardStatus eq 'Closed')"
          );
        }
        //PCBOR - No Max and Min
        else if (mlss.server_id == "11") {
          console.log("PCBOR No Max and Min");
          urlArr.push(
            "(startswith(StandardStatus,'Active') or startswith(StandardStatus,'Short') or startswith(StandardStatus,'Time') or StandardStatus eq 'Pending') or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and StandardStatus eq 'Closed')"
          );
        }
      }
    }

    if (min_price) {
      if (max_price) {
        //CTAR - Use Max and Min
        if (mlss.server_id == "15") {
          console.log("CTAR Use Max and Min");
          urlArr.push(
            "((StandardStatus eq 'Active' or StandardStatus eq 'Active Contingent' or StandardStatus eq 'Pending' or StandardStatus eq 'Application Approved' or StandardStatus eq 'Application Submitted') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or ((date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (StandardStatus eq 'Closed' or StandardStatus eq 'Rented')) and (ClosePrice ge " +
              min_price +
              " and ClosePrice le " +
              max_price +
              "))"
          );
        }
        //TMLS - Use Max and Min
        else if (
          mlss.server_id == "39" ||
          mlss.server_id == "77" ||
          mlss.server_id == "55" ||
          mlss.server_id == "65"
        ) {
          console.log("TMLS/COLA/FMLS/IMLS Use Max and Min");
          urlArr.push(
            "((startswith(StandardStatus,'Active') or (StandardStatus eq 'Coming Soon')) and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (startswith(StandardStatus,'Pend') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (startswith(StandardStatus,'Contingent') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (startswith(StandardStatus, 'Closed') and (ClosePrice ge " +
              min_price +
              " and ClosePrice le " +
              max_price +
              ")))"
          );
        }
        //ABOR - Use Max and Min
        else if (
          mlss.server_id == "46" ||
          mlss.server_id == "47" ||
          mlss.server_id == "35" ||
          mlss.server_id == "38" ||
          mlss.server_id == "56" ||
          mlss.server_id == "49" ||
          mlss.server_id == "62" ||
          mlss.server_id == "60" ||
          mlss.server_id == "2" ||
          mlss.server_id == "14" ||
          mlss.server_id == "8"
        ) {
          console.log("ABOR/HAR/GAMLS/GGAR/NEFMLS/SABOR/METRO Use Max and Min");
          urlArr.push(
            "(startswith(StandardStatus,'Active') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or ((startswith(StandardStatus, 'Pend') or startswith(StandardStatus, 'Cont') or startswith(StandardStatus, 'First')) and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (startswith(StandardStatus,'Option') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and ((startswith(StandardStatus, 'Sold') or startswith(StandardStatus, 'Closed') or startswith(StandardStatus, 'Rental Leased') ) and (ClosePrice ge " +
              min_price +
              " and ClosePrice le " +
              max_price +
              ")))"
          );
        }
        //CMLS - Use Max and Min
        else if (mlss.server_id == "54") {
          console.log("CMLS Use Max and Min");
          urlArr.push(
            "(startswith(StandardStatus,'Active') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (startswith(StandardStatus,'Under') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (startswith(StandardStatus, 'Closed') and (ClosePrice ge " +
              min_price +
              " and ClosePrice le " +
              max_price +
              ")))"
          );
        }
        //NTREIS - Use Max and Min
        else if (
          mlss.server_id == "1" ||
          mlss.server_id == "76" ||
          mlss.server_id == "40" ||
          mlss.server_id == "53"
        ) {
          console.log("NTREIS/STELLAR/NWMLS/CINCY Use Max and Min");
          urlArr.push(
            "(startswith(StandardStatus,'A') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (startswith(StandardStatus,'P') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and ((startswith(StandardStatus, 'S') or startswith(StandardStatus, 'C')) and (ClosePrice ge " +
              min_price +
              " and ClosePrice le " +
              max_price +
              ")))"
          );
        }
        //BEACHES - Use Max and Min
        else if (mlss.server_id == "RGM") {
          console.log("BEACHES Use Max and Min");
          urlArr.push(
            "(startswith(StandardStatus,'Active') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (startswith(StandardStatus,'Pend') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (startswith(StandardStatus,'Backup') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (startswith(StandardStatus,'Contingent') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and ((startswith(StandardStatus, 'Closed') or startswith(StandardStatus, 'Rented')) and (ClosePrice ge " +
              min_price +
              " and ClosePrice le " +
              max_price +
              ")))"
          );
        }
        //MIAMI - Use Max and Min
        else if (mlss.server_id == "63" || mlss.server_id == "58") {
          console.log("MIAMI Use Max and Min");
          urlArr.push(
            "(startswith(StandardStatus,'Active') and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (StandardStatus eq 'Pending' and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (StandardStatus eq 'Closed' and (ClosePrice ge " +
              min_price +
              " and ClosePrice le " +
              max_price +
              ")))"
          );
        }
        //PCBOR - Use Max and Min
        else if (mlss.server_id == "11") {
          console.log("PCBOR Use Max and Min");
          urlArr.push(
            "((startswith(StandardStatus,'Active') or startswith(StandardStatus,'Short') or startswith(StandardStatus,'Time')) and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (StandardStatus eq 'Pending' and (ListPrice ge " +
              min_price +
              " and ListPrice le " +
              max_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (StandardStatus eq 'Closed' and (ClosePrice ge " +
              min_price +
              " and ClosePrice le " +
              max_price +
              ")))"
          );
        }
      } else {
        //CTAR - Use Min
        if (mlss.server_id == "15") {
          console.log("CTAR Use Min");
          urlArr.push(
            "((StandardStatus eq 'Active' or StandardStatus eq 'Active Contingent' or StandardStatus eq 'Pending' or StandardStatus eq 'Application Approved' or StandardStatus eq 'Application Submitted') and (ListPrice ge " +
              min_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (StandardStatus eq 'Closed' or StandardStatus eq 'Rented') and ClosePrice ge " +
              min_price +
              ")"
          );
        }
        //TMLS - Use Min
        else if (
          mlss.server_id == "39" ||
          mlss.server_id == "77" ||
          mlss.server_id == "55" ||
          mlss.server_id == "65"
        ) {
          console.log("TMLS/COLA/FMLS Use Min");
          urlArr.push(
            "((startswith(StandardStatus,'Active') or (StandardStatus eq 'Coming Soon')) and (ListPrice ge " +
              min_price +
              ")) or (startswith(StandardStatus,'Pend') and (ListPrice ge " +
              min_price +
              ")) or (startswith(StandardStatus,'Contingent') and (ListPrice ge " +
              min_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (startswith(StandardStatus, 'Closed') and ClosePrice ge " +
              min_price +
              "))"
          );
        }
        //ABOR - Use Min
        else if (
          mlss.server_id == "46" ||
          mlss.server_id == "47" ||
          mlss.server_id == "35" ||
          mlss.server_id == "38" ||
          mlss.server_id == "56" ||
          mlss.server_id == "49" ||
          mlss.server_id == "62" ||
          mlss.server_id == "60" ||
          mlss.server_id == "2" ||
          mlss.server_id == "14" ||
          mlss.server_id == "8"
        ) {
          console.log("ABOR/HAR/GAMLS/GGAR/NEFMLS/SABOR/METRO Use Min");
          urlArr.push(
            "(startswith(StandardStatus,'Active') and (ListPrice ge " +
              min_price +
              ")) or ((startswith(StandardStatus, 'Pend') or startswith(StandardStatus, 'Cont') or startswith(StandardStatus, 'First')) and (ListPrice ge " +
              min_price +
              ")) or (startswith(StandardStatus,'Option') and (ListPrice ge " +
              min_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and ((startswith(StandardStatus, 'Sold') or startswith(StandardStatus, 'Closed') or startswith(StandardStatus, 'Rental Leased') ) and ClosePrice ge " +
              min_price +
              "))"
          );
        }
        //CMLS - Use Min
        else if (mlss.server_id == "54") {
          console.log("CMLS Use Min");
          urlArr.push(
            "(startswith(StandardStatus,'Active') and (ListPrice ge " +
              min_price +
              ")) or (startswith(StandardStatus,'Under') and (ListPrice ge " +
              min_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (startswith(StandardStatus, 'Closed') and ClosePrice ge " +
              min_price +
              "))"
          );
        }
        //NTREIS - Use Min
        else if (
          mlss.server_id == "1" ||
          mlss.server_id == "76" ||
          mlss.server_id == "40" ||
          mlss.server_id == "53"
        ) {
          console.log("NTREIS/STELLAR/NWMLS/CINCY Use Min");
          urlArr.push(
            "(startswith(StandardStatus,'A') and (ListPrice ge " +
              min_price +
              ")) or (startswith(StandardStatus,'P') and (ListPrice ge " +
              min_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and ((startswith(StandardStatus, 'S') or startswith(StandardStatus, 'C')) and ClosePrice ge " +
              min_price +
              "))"
          );
        }
        //BEACHES - Use Min
        else if (mlss.server_id == "RGM") {
          console.log("BEACHES Use Min");
          urlArr.push(
            "(startswith(StandardStatus, 'Active') and (ListPrice ge " +
              min_price +
              ")) or (startswith(StandardStatus, 'Pend') and (ListPrice ge " +
              min_price +
              ")) or (startswith(StandardStatus, 'Back') and (ListPrice ge " +
              min_price +
              ")) or (startswith(StandardStatus, 'Cont') and (ListPrice ge " +
              min_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and ((startswith(StandardStatus, 'Closed') or startswith(StandardStatus, 'Rented')) and ClosePrice ge " +
              min_price +
              "))"
          );
        }
        //MIAMI - Use Min
        else if (mlss.server_id == "63" || mlss.server_id == "58") {
          console.log("MIAMI Use Min");
          urlArr.push(
            "(startswith(StandardStatus,'Active') and (ListPrice ge " +
              min_price +
              ")) or (StandardStatus eq 'Pending' and (ListPrice ge " +
              min_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (StandardStatus eq 'Closed' and (ClosePrice ge " +
              min_price +
              ")))"
          );
        }
        //PCBOR - Use Min
        else if (mlss.server_id == "11") {
          console.log("PCBOR Use Min");
          urlArr.push(
            "((startswith(StandardStatus,'Active') or startswith(StandardStatus,'Short') or startswith(StandardStatus,'Time')) and (ListPrice ge " +
              min_price +
              ")) or (StandardStatus eq 'Pending' and (ListPrice ge " +
              min_price +
              ")) or (date(CloseDate) ge '" +
              dateSet.toISOString() +
              "' and (StandardStatus eq 'Closed' and (ClosePrice ge " +
              min_price +
              ")))"
          );
        }
      }
    }

    if (max_price && !min_price) {
      //CTAR - Use Max
      if (mlss.server_id == "15") {
        console.log("CTAR Use Max");
        urlArr.push(
          "((StandardStatus eq 'Active' or StandardStatus eq 'Active Contingent' or StandardStatus eq 'Pending' or StandardStatus eq 'Application Approved' or StandardStatus eq 'Application Submitted') and (ListPrice le " +
            max_price +
            ")) or (date(CloseDate) ge '" +
            dateSet.toISOString() +
            "' and (StandardStatus eq 'Closed' or StandardStatus eq 'Rented') and ClosePrice le " +
            max_price +
            ")"
        );
      }
      //TMLS - Use Max
      else if (
        mlss.server_id == "39" ||
        mlss.server_id == "77" ||
        mlss.server_id == "55" ||
        mlss.server_id == "65"
      ) {
        console.log("TMLS/COLA/FMLS Use Max");
        urlArr.push(
          "((startswith(StandardStatus,'Active') or (StandardStatus eq 'Coming Soon')) and (ListPrice le " +
            max_price +
            ")) or (startswith(StandardStatus,'Pend') and (ListPrice le " +
            max_price +
            ")) or (date(CloseDate) ge '" +
            dateSet.toISOString() +
            "' and (startswith(StandardStatus, 'Closed') and ClosePrice le " +
            max_price +
            "))"
        );
      }
      //ABOR - Use Max
      else if (
        mlss.server_id == "46" ||
        mlss.server_id == "47" ||
        mlss.server_id == "35" ||
        mlss.server_id == "38" ||
        mlss.server_id == "56" ||
        mlss.server_id == "49" ||
        mlss.server_id == "62" ||
        mlss.server_id == "60" ||
        mlss.server_id == "2" ||
        mlss.server_id == "14" ||
        mlss.server_id == "8"
      ) {
        console.log("ABOR/HAR/GAMLS/GGAR/NEFMLS/SABOR/METRO Use Max");
        urlArr.push(
          "(startswith(StandardStatus,'Active') and (ListPrice le " +
            max_price +
            ")) or ((startswith(StandardStatus, 'Pend') or startswith(StandardStatus, 'Cont') or startswith(StandardStatus, 'First')) and (ListPrice le " +
            max_price +
            ")) or (startswith(StandardStatus,'Option') and (ListPrice le " +
            max_price +
            ")) or (date(CloseDate) ge '" +
            dateSet.toISOString() +
            "' and ((startswith(StandardStatus, 'Sold') or startswith(StandardStatus, 'Closed') or startswith(StandardStatus, 'Rental Leased') ) and ClosePrice le " +
            max_price +
            "))"
        );
      }
      //CMLS - Use Max
      else if (mlss.server_id == "54") {
        console.log("CMLS Use Max");
        urlArr.push(
          "(startswith(StandardStatus,'Active') and (ListPrice le " +
            max_price +
            ")) or (startswith(StandardStatus,'Under') and (ListPrice le " +
            max_price +
            ")) or (date(CloseDate) ge '" +
            dateSet.toISOString() +
            "' and (startswith(StandardStatus, 'Closed') and ClosePrice le " +
            max_price +
            "))"
        );
      }
      //NTREIS - Use Max
      else if (
        mlss.server_id == "1" ||
        mlss.server_id == "76" ||
        mlss.server_id == "40" ||
        mlss.server_id == "53"
      ) {
        console.log("NTREIS/STELLAR/NWMLS/CINCY Use Max");
        urlArr.push(
          "(startswith(StandardStatus,'A') and (ListPrice le " +
            max_price +
            ")) or (startswith(StandardStatus,'P') and (ListPrice le " +
            max_price +
            ")) or (date(CloseDate) ge '" +
            dateSet.toISOString() +
            "' and ((startswith(StandardStatus, 'S') or startswith(StandardStatus, 'C')) and ClosePrice le " +
            max_price +
            "))"
        );
      }
      //BEACHES - Use Max
      else if (mlss.server_id == "RGM") {
        console.log("BEACHES Use Max");
        urlArr.push(
          "(startswith(StandardStatus,'Active') and (ListPrice le " +
            max_price +
            ")) or (startswith(StandardStatus,'Pend') and (ListPrice le " +
            max_price +
            ")) or (startswith(StandardStatus,'Under') and (ListPrice le " +
            max_price +
            ")) or (date(CloseDate) ge '" +
            dateSet.toISOString() +
            "' and ((startswith(StandardStatus, 'Closed') or startswith(StandardStatus, 'Rented')) and ClosePrice le " +
            max_price +
            "))"
        );
      }
      //MIAMI - Use Max
      else if (mlss.server_id == "63" || mlss.server_id == "58") {
        console.log("MIAMI Use Max");
        urlArr.push(
          "(startswith(StandardStatus,'Active') and (ListPrice le " +
            max_price +
            ")) or (StandardStatus eq 'Pending' and (ListPrice le " +
            max_price +
            ")) or (date(CloseDate) ge '" +
            dateSet.toISOString() +
            "' and (StandardStatus eq 'Closed' and (ClosePrice le " +
            max_price +
            ")))"
        );
      }
      //PCBOR - Use Max
      else if (mlss.server_id == "11") {
        console.log("MIAMI Use Max");
        urlArr.push(
          "((startswith(StandardStatus,'Active') or startswith(StandardStatus,'Short') or startswith(StandardStatus,'Time')) and (ListPrice le " +
            max_price +
            ")) or (StandardStatus eq 'Pending' and (ListPrice le " +
            max_price +
            ")) or (date(CloseDate) ge '" +
            dateSet.toISOString() +
            "' and (StandardStatus eq 'Closed' and (ClosePrice le " +
            max_price +
            ")))"
        );
      }
    }

    if (min_price === "10000" || min_price === "100") {
      min_price = "";
    }

    //-- Pricing Checks END --//

    if (urlArr.length > 0) {
      console.log("Type Check: " + listing_type);

      //CTAR
      if (mlss.server_id == "15") {
        if (listing_type === "'Rental'") {
          console.log("Type Check CTAR: " + listing_type);
          base +=
            "&$filter=server_id eq " +
            mlss.server_id +
            " and (PropertyType eq 'Residential') and " +
            furnished +
            " and ";
        } else {
          console.log("Move On");
          base +=
            "&$filter=server_id eq " +
            mlss.server_id +
            " and (PropertyType eq null) and ";
        }
      }
      //ABOR
      else if (
        mlss.server_id == "46" ||
        mlss.server_id == "76" ||
        mlss.server_id == "63" ||
        mlss.server_id == "65" ||
        mlss.server_id == "60"
      ) {
        if (
          listing_type === "'Rental'" &&
          (mlss.server_id == "63" || mlss.server_id == "76")
        ) {
          base +=
            "&$filter=server_id eq " +
            mlss.server_id +
            " and (PropertyType eq 'Residential Lease') and ";
        } else if (listing_type === "'Rental'" && mlss.server_id == "65") {
          base +=
            "&$filter=server_id eq " +
            mlss.server_id +
            " and (PropertyType eq 'ResidentialLease') and ";
        } else {
          base +=
            "&$filter=server_id eq " +
            mlss.server_id +
            " and (PropertyType eq 'Residential') and ";
        }
      }
      //FMLS & GAMLS
      else if (mlss.server_id == "35" || mlss.server_id == "55") {
        //GAMLS
        if (listing_type === "'Rental'" && mlss.server_id == "35") {
          base +=
            "&$filter=server_id eq " +
            mlss.server_id +
            " and (PropertyType eq 'Rental Residential') and ";
          //FMLS
        } else if (listing_type === "'Rental'" && mlss.server_id == "55") {
          base +=
            "&$filter=server_id eq " +
            mlss.server_id +
            " and (PropertyType eq 'Residential Lease') and ";
        } else {
          base += "&$filter=server_id eq " + mlss.server_id + " and ";
        }
      }
      //BEACHES
      else if (mlss.server_id == "RGM") {
        if (listing_type === "'Rental'") {
          base +=
            "&$filter=(server_id eq 51 or server_id eq 72) and ((PropertyType eq 'F') or (PropertyType eq 'Residential Rental') or (PropertyType eq 'Residential Lease')) and ";
        } else {
          base +=
            "&$filter=(server_id eq 51 or server_id eq 72) and ((PropertyType ne 'B') and (PropertyType ne 'C') and (PropertyType ne 'D') and (PropertyType ne 'E') and (PropertyType ne 'F') and (PropertyType ne 'Business Opportunity') and (PropertyType ne 'Commercial/Business/Agricultural/Industrial Land') and (PropertyType ne 'Commercial/Industrial') and (PropertyType ne 'Residential Income') and (PropertyType ne 'Residential Land/Boat Docks') and (PropertyType ne 'Residential Rental') and (PropertyType ne 'Residential Lease') and (PropertyType ne 'Land') and (PropertyType ne 'Farm') and (PropertyType ne 'Commercial Sale') and (PropertyType ne 'Residential Income')) and ";
        }
      }
      //BEACHES
      else if (mlss.server_id == "58") {
        if (listing_type === "'Rental'") {
          base +=
            "&$filter=server_id eq 58 and (PropertyType ne 'Residential') and ";
        } else {
          base +=
            "&$filter=server_id eq 58 and (PropertyType eq 'Residential') and ";
        }
      }
      //BEACHES
      else if (mlss.server_id == "8") {
        if (listing_type === "'Rental'") {
          base +=
            "&$filter=server_id eq 8 and (PropertyType ne 'Residential Lease') and ";
        } else {
          base +=
            "&$filter=server_id eq 8 and (PropertyType eq 'Residential') and ";
        }
      }
      //BEACHES
      else if (mlss.server_id == "14") {
        if (listing_type === "'Rental'") {
          base +=
            "&$filter=server_id eq 14 and (PropertySubType ne 'RESIDENTIAL') and ";
        } else {
          base +=
            "&$filter=server_id eq 14 and (PropertySubType eq 'RESIDENTIAL') and ";
        }
      } else {
        base += "&$filter=server_id eq " + mlss.server_id + " and ";
      }

      for (var i = 0; i < urlArr.length; i++) {
        base += urlArr[i];
        if (i + 1 < urlArr.length) {
          base += " and ";
        }
      }
    }

    //console.log("Base: " + base);

    return base;
  } else if (isOutAPC === true) {
    console.log("Special");
    // Make 2 replaced with mlss.server_id
    var base = "$top=250";

    var selectArr = [
      "ListingKey",
      "ListingId",
      "StandardStatus",
      "ListingContractDate",
      "CloseDate",
      "OnMarketDate",
      "PendingTimestamp",
      "ContractStatusChangeDate",
      "OffMarketDate",
      "ModificationTimestamp",
      "StatusChangeTimestamp",
      "PriceChangeTimestamp",
      "OriginalEntryTimestamp",
      "DaysOnMarket",
      "CumulativeDaysOnMarket",
      "ClosePrice",
      "ListPrice",
      "StreetNumber",
      "StreetNumberNumeric",
      "StreetDirPrefix",
      "StreetName",
      "StreetSuffix",
      "StreetDirSuffix",
      "UnitNumber",
      "City",
      "StateOrProvince",
      "Country",
      "PostalCode",
      "CountyOrParish",
      "MLSAreaMajor",
      "Township",
      "SubdivisionName",
      "Latitude",
      "Longitude",
      "PropertyType",
      "PropertySubType",
      "BedroomsTotal",
      "BathroomsTotalInteger",
      "BathroomsFull",
      "BathroomsHalf",
      "LivingArea",
      "YearBuilt",
      "ParcelNumber",
      "BuildingAreaTotal",
      "ArchitecturalStyle",
      "BathroomsTotalDecimal",
      "PoolFeatures",
      "PoolPrivateYN",
      "WaterfrontYN",
      "WaterBodyName",
      "WaterfrontFeatures",
      "LotFeatures",
      "SeniorCommunityYN",
      "AssociationYN",
      "CommunityFeatures",
      "AssociationName",
      "PublicSurveyRange",
      "MajorChangeTimestamp",
      "OnMarketTimestamp",
      "OffMarketTimestamp",
      "OriginalListPrice",
      "PhotosCount",
      "PhotosChangeTimestamp",
      "ListingTerms",
      "SpecialListingConditions",
      "StreetSuffixModifier",
      "MLSAreaMinor",
      "ElementarySchool",
      "ElementarySchoolDistrict",
      "MiddleOrJuniorSchool",
      "MiddleOrJuniorSchoolDistrict",
      "HighSchool",
      "HighSchoolDistrict",
      "AssociationFee",
      "AssociationFeeIncludes",
      "AssociationAmenities",
      "PetsAllowed",
      "View",
      "ViewYN",
      "InteriorFeatures",
      "ExteriorFeatures",
      "Furnished",
      "BathroomsPartial",
      "photos",
    ];

    // Selected Specific Valued Constructed
    base += "&$select=";

    for (var i = 0; i < selectArr.length; i++) {
      if (i === selectArr.length - 1) {
        //console.log(" Not Ok")
        base += selectArr[i];
      } else {
        //console.log("Ok")
        base += selectArr[i] + ",";
      }
    }
    if (body.params.mlsid) {
      console.log("FOUND MLS");
      let paragonMls = body.params.mlsid;
      if (paragonMls === "IMLS") {
        //console.log('IMLS')
        base += "&$filter=server_id eq 2 and ";
      } else {
        //console.log('NO IMLS')
        base += "&$filter=server_id eq 51 and ";
      }
    } else {
      console.log("No Return");
      return base;
    }

    let listingkeys = body.params.listingkey.split(",");
    //console.log(listingkeys);
    listingkeys.forEach(function (listingkey, index) {
      //console.log(index);
      //console.log(listingkeys.length);
      if (index < listingkeys.length - 1) {
        base += "ListingId eq '" + listingkey + "' or ";
      } else {
        base += "ListingId eq '" + listingkey + "'";
      }
    });
    console.log("Base Special: " + base);

    return base;
  } else {
    console.log("Anamoly");
    var base = "$top=250&$filter=server_id eq " + mlss.server_id;
    console.log("Base Anamoly: " + base);

    return base;
  }
};

// Export
exports.retsrabbits = retsrabbits;
