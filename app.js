const apiKey = "6dcbc31b2b088303c406cd5c1fdf18a9"

const searchInput = document.querySelector(".search-box__input")
const searchButton = document.querySelector(".search-box__btn")

function searchHandle() {
    if (searchInput.value) {
        getWeatherMain(searchInput.value)
        getWeatherHourly(searchInput.value)
        getWeatherWeek(searchInput.value)
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

// текущая погода

async function getWeatherMain(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.cod === 200) {
        document.querySelectorAll(".city").forEach(item => item.innerHTML = data.name)
        document.querySelector(".main-today__temp").innerHTML = Math.round(data.main.temp)
        document.querySelector(".humidity__value").innerHTML = Math.round(data.main.humidity)
        document.querySelector(".pressure__value").innerHTML = Math.round(data.main.pressure / 1.333)
        document.querySelector(".wind__value").innerHTML = Math.round(data.wind.speed)
        document.querySelector(".main-today__icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        
        document.querySelector(".page__container").style.display = "flex"
    } else {
        alert(data.message)
    }
}

// по часам

const hourlyCards = document.querySelector(".today__hourly")
const templateHourly = document.querySelector("#template-hourly")

for (let i = 0; i < 8; i++) {
    const item = templateHourly.content.cloneNode(true)
    hourlyCards.append(item)
}

async function getWeatherHourly(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    const hourlyTemps = document.querySelectorAll(".hourly__temp")
    const hourlyTimes = document.querySelectorAll(".hourly__time")
    const hourlyIcons = document.querySelectorAll(".hourly__icon")
    
    const timezone = data.city.timezone
    
    for (let i = 0; i < 8; i++) {
        hourlyTimes[i].innerHTML = new Date((data.list[i].dt + timezone) * 1000).toUTCString().slice(17, 22)
        hourlyTemps[i].innerHTML = Math.round(data.list[i].main.temp)
        hourlyIcons[i].src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
    }
}

// неделя

const weekCards = document.querySelector(".week")
const templateWeek = document.querySelector("#template-week")

for (let i = 0; i < 5; i++) {
    const item = templateWeek.content.cloneNode(true)
    weekCards.append(item)
}

async function getWeatherWeek(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    const weekDates = document.querySelectorAll(".week__date")
    const weekTimes = document.querySelectorAll(".week__time")
    const weekIcons = document.querySelectorAll(".week__icon")
    const weekTemps = document.querySelectorAll(".week__temp")
    const weekPressures = document.querySelectorAll(".week__pressure")
    const weekWinds = document.querySelectorAll(".week__wind")
    const weekHumidities = document.querySelectorAll(".week__humidity")
    
    const timezone = data.city.timezone
    
    for (let i = 0; i < 5; i++) {
        weekDates[i].innerHTML = new Date((data.list[i * 8].dt + timezone) * 1000).toUTCString().slice(0, 12)
    }
    for (let i = 0; i < 20; i++) {
        weekTimes[i].innerHTML = new Date((data.list[i * 2].dt + timezone) * 1000).toUTCString().slice(17, 22)
        weekIcons[i].src = `https://openweathermap.org/img/wn/${data.list[i * 2].weather[0].icon}@2x.png`
        weekTemps[i].innerHTML = Math.round(data.list[i * 2].main.temp)
        weekPressures[i].innerHTML = Math.round(data.list[i * 2].main.pressure / 1.333)
        weekWinds[i].innerHTML = Math.round(data.list[i * 2].wind.speed)
        weekHumidities[i].innerHTML = Math.round(data.list[i * 2].main.humidity)
    }
    
}   

// swiper

const swiper = new Swiper('.swiper', {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    allowTouchMove: false,
})