function return_string(obj){
    var arr = [];
    var arr_2 = [0,0];
    var return_1=[];
    var return_2=[];
    
    var return_val="";
    // temp
    // humidity
    //CO2 = carbondioxide
    //NH4 = ammonia
    //CO = carbonmonoxide

    
    // tempertature
    if (obj.temp < 18.33)
    {
        arr.push("temperature");
        arr_2[0] = -1;
    }

    else if (obj.temp > 23.89)
    {
        arr.push("temperature");
    }

    // humidity
    if (obj.humidity < 30)
    {
        arr.push("humidity");
        arr_2[1] = -1 ;
    }

    else if (obj.humidity > 50)
    {
        arr.push("humidity");
    }

    // CO2 = Carbondioxide

    if (obj.CO2 > 1000)
    {
        arr.push("carbondioxide");
    }

    // CO = carbonmonoxide
    if (obj.CO > 50)
    {
        arr.push("carbonmonoxide");
    }

    // NH4 = ammonia
    if (obj.NH4 > 25)
    {
        arr.push("ammonia");
    }


    // else{
    //     arr.push("safe");
    // }

    if (arr.length > 1 || arr.length==1)
    {
        //console.log(arr);
        // const [first,...rest] = arr;
        // arr = arr.slice(0,1);
        // rest.forEach(v => {
        //     var st= " and ";
        //     index = rest.indexOf(v);
        //     rest.splice(index,1,st+v);
        //     arr.push(rest[index]);
          
        // })
        // //console.log(arr)
        // rest.length = 0;

        return_1 = makeSentence(arr, arr_2, return_2);
        //return_2 = makePrecautions(arr);
        
        return_val = return_val + "Detections:"+"\n";

        var temp_arr =""

        return_1.forEach(item => {
            temp_arr = temp_arr + item;
        })

        return_val = sentenceCase(temp_arr);
        temp_arr =""

        return_val = return_val + "\n\n" + "Precautions:"+"\n";

        return_2.forEach(item => {
            temp_arr = temp_arr + item+ "\n";
        })

        return_val = return_val + sentenceCase(temp_arr);
        temp_arr.length=0;

        // console.log(return_val);
        //console.log(sentenceCase(return_val));
        
    

    }

    else{
        return_val = return_val+"The conditions seem safe around you!"
    }
    
    console.log(return_val);
    // return arr;

}

function makeSentence(params_1, params_2, r2)
{
   // var st =["none","none"];
    var words=[". Additionally, ",". In addition to this, ",". Furthermore, "," and ",". "," aswell"," too"," also"]
    var flag_t = false;
    var flag_h = false;
   // var flag_all =false;
    var temp="";
    var sentence=[];


    if (params_1.includes("temperature"))
    {
        flag_t = true;
        switch (params_2[0]){
            case 0:
                //st[0]= "above";
                
                temp = ""
                temp = "temperature is above the limit set by WHO";
                r2.push("For high temperatures, stay in air-conditioned buildings as much as you can. Air-conditioning is the number one way to protect yourself against heat-related illness and death. If your home is not air-conditioned, reduce your risk for heat-related illness by spending time in public facilities that are air-conditioned and using air conditioning in vehicles. Drink more water than usual and don’t wait until you’re thirsty to drink.")
                sentence.push(temp);
            case -1:
                //st[0] = "below";
                
                temp = ""
                temp = "temperature is below the limit set by WHO";
                r2.push("For low temperatures, minimize time spent outdoors while temperatures are low and do not ignore shivering. It's an important first sign that the body is losing heat and is a signal to return indoors. Dress appropriately for the weather and stay dry.")
                sentence.push(temp);
        }
    }

    if (params_1.includes("humidity"))
    {
        flag_h = true;
        switch (params_2[1]){
            case 0:
                //st[1] = "above";

                temp = "";
                if (flag_t == true){
                    temp = temp + words[getRandomArbitrary(3,5)];
                }
                temp = temp + "humidity is above the limit set by WHO";
                r2.push("For high humidity, stay hydrated by drinking plenty of fluids, especially water. Stay cool by wearing a hat and lightweight, light-colored, loose-fitting clothing. Avoid or limit exercise during the hottest hours of the day")
                sentence.push(temp);

            case -1:
                //st[1] = "below";

                temp = "";
                if (flag_t == true){
                    temp = temp + words[getRandomArbitrary(3,5)];
                }
                temp = temp + "humidity is below the limit set by WHO";
                r2.push("For low humidity, use a humidifier or vaporizer, boil water on your stove and take a shower and create a steam bath.");
                sentence.push(temp);
        }
    }

    temp ="";
    if ((flag_t && flag_h) == true){

        temp = temp + words[getRandomArbitrary(0,3)];
    }

    var temp_arr = params_1.filter(removeTempHumid);

    if (temp_arr.length!=0){

        temp_arr.forEach(element => {
            temp = temp + element+", ";
    
            switch (element){
                case "carbondioxide":
                    r2.push("For carbondioxide, keep high ventilation.");
                    break;
                case "carbonmonoxide":
                    r2.push("For carbonmonoxide, let in some fresh air. Open the windows!")
                    break;
                case "ammonia":
                    r2.push("For ammonia, move victim to fresh air. If breathing is difficult, trained personnel should administer emergency oxygen.In case of skin and eyes, flush with lukewarm, gently flowing water for 5 minutes. If irritation or pain persists, see a doctor.");
                    break;
                default:
                    
            }
        });

        
    temp = temp + "is above the limit set by WHO" + words[getRandomArbitrary(5,8)];

    }

    temp = temp+".";

    sentence.push(temp);
    return sentence;

}

// HELPER FUNCTIONS //

// function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   }

function sentenceCase(input, lowercaseBefore) {
    input = ( input === undefined || input === null ) ? '' : input;
    if (lowercaseBefore) { input = input.toLowerCase(); }
    return input.toString().replace( /(^|\. *)([a-z])/g, function(match, separator, char) {
        return separator + char.toUpperCase();
    });
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

function removeTempHumid(item){
    if(item != "temperature" && item!= "humidity")
    {
        return item;
    }
}
//--------------------------------------------------------------------//

var JSONObj = { "temp":20, "humidity":20,"CO2":30,"NH4":22,"CO":44};

var ans = return_string(JSONObj)
//ans.forEach((val)=>{console.log(val)})
   