const  submitbtn=  document.getElementById('submitbtn');
const city = document.getElementById('city');
const cityName = document.getElementById('cityName');
const temp = document.getElementById('temp');
const tempStatus = document.getElementById('tempStatus');
const hide =  document.getElementById("hidden");



const getInfo = async(event)=>{
   event.preventDefault();
   let cityVal = city.value;
   if(cityVal==''){
      cityName.innerText = 'please enter city name before click on search button! 😊';
      
   }
   else {
        try {
         let url =`http://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=cb336ac809e1e492a52fc977cca63378`;
         const response =  await fetch(url);
         const data  =  await response.json();
         const arrdata = [data];
         cityName.innerText = `${arrdata[0].name}, ${arrdata[0].sys.country}`
         temp.innerText = arrdata[0].main.temp;
         let tempicon = arrdata[0].weather[0].main;
         if (tempicon = "Clear"){
            tempStatus.innerHTML = "<i class='fa fa-sun' style='color: #f9d71c !important; ''>";
         }
         else if (tempicon =='Rain'){
            tempStatus.innerHTML = `<i class='fa fa-rain' style="color:#a4b0be"'>`;
         }
         else{
            tempStatus.innerHTML = `<i class='fa fa-sun' style="color:#f1f2f6"'>`;

         }
        
         

        }
      catch{
         cityName.innerText = 'please enter city name properly! 😊';
         
      }
       
   }
       
}
submitbtn.addEventListener('click',getInfo);