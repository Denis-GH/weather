const apiKey = "6dcbc31b2b088303c406cd5c1fdf18a9"

const searchInput = document.querySelector(".search-box__input")
const searchButton = document.querySelector(".search-box__btn")

// текущая погода

async function getWeatherMain(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.cod === 200) {
        document.querySelector(".today__city").innerHTML = data.name
        document.querySelector(".main-today__temp").innerHTML = Math.round(data.main.temp)
        document.querySelector(".humidity__value").innerHTML = Math.round(data.main.humidity)
        document.querySelector(".visibility__value").innerHTML = Math.round(data.visibility / 1000)
        document.querySelector(".pressure__value").innerHTML = Math.round(data.main.pressure / 1.333)
        document.querySelector(".wind__value").innerHTML = Math.round(data.wind.speed)
        document.querySelector(".today__date").innerHTML = new Date(data.dt * 1000).toDateString().slice(0, 10)
        document.querySelector(".main-today__icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        
        document.querySelector(".container").style.display = "flex"
    } else {
        alert(data.message)
    }
}

function searchHandle() {
    if (searchInput.value) {
        getWeatherMain(searchInput.value)
        getWeatherHourly(searchInput.value)
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

// по часам

const hourlyCards = document.querySelector(".today__hourly")
const templateHourly = document.querySelector("#template-hourly")

async function getWeatherHourly(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    
    const response = await fetch(apiUrl)
    const data = await response.json()

    const hourlyTimes = document.querySelectorAll(".hourly__time");
    const hourlyTemps = document.querySelectorAll(".hourly__temp");
    const hourlyIcons = document.querySelectorAll(".hourly__icon");
    
    const timezone = data.city.timezone

    for (let i = 0; i < 8; i++) {
        hourlyTimes[i].innerHTML = new Date((data.list[i].dt + timezone) * 1000).toUTCString().slice(17, 22)
        hourlyTemps[i].innerHTML = Math.round(data.list[i].main.temp)
        hourlyIcons[i].src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
    }

}

for (let i = 0; i < 8; i++) {
    const item = templateHourly.content.cloneNode(true)
    hourlyCards.append(item)
}