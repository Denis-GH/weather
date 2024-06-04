const apiKey = "6dcbc31b2b088303c406cd5c1fdf18a9"

const searchInput = document.querySelector(".search-box__input")
const searchButton = document.querySelector(".search-box__btn")

// текущая погода

async function checkWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(data)

    if (data.cod === 200) {
        document.querySelector(".weather__city").innerHTML = data.name
        document.querySelector(".main-weather__temp").innerHTML = Math.round(data.main.temp)
        document.querySelector(".humidity__value").innerHTML = Math.round(data.main.humidity)
        document.querySelector(".visibility__value").innerHTML = Math.round(data.visibility / 1000)
        document.querySelector(".pressure__value").innerHTML = Math.round(data.main.pressure / 1.333)
        document.querySelector(".wind__value").innerHTML = Math.round(data.wind.speed)
        document.querySelector(".weather__date").innerHTML = new Date(data.dt * 1000).toDateString().slice(0, 10)
        document.querySelector(".main-weather__icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        
        document.querySelector(".weather").style.display = "flex"
    } else {
        alert(data.message)
    }
}

function searchHandle() {
    if (searchInput.value) {
        checkWeather(searchInput.value)
    } else {
        alert('enter a city')
    }
    searchInput.value = ""
}

searchButton.addEventListener("click", searchHandle)

searchInput.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        searchHandle()
    }
})