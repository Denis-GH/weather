const weatherApiKey = "00f7fee2b6c64b14a4950110242407"
const mapApikey = "38786247-3bfc-4e15-a665-578827b1dfa8"

const searchInput = document.querySelector(".search-box__input")
const searchButton = document.querySelector(".search-box__btn")

const loader = document.querySelector(".map__loader")
const map = document.querySelector(".map__image")
let coordinates

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

// current weather

async function getWeatherMain(city) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}`
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    document.querySelectorAll(".city").forEach(item => item.innerHTML = data.location.name)
    document.querySelector(".main-today__temp").innerHTML = Math.round(data.current.temp_c)
    document.querySelector(".humidity__value").innerHTML = Math.round(data.current.humidity)
    document.querySelector(".pressure__value").innerHTML = Math.round(data.current.pressure_mb / 1.333)
    document.querySelector(".wind__value").innerHTML = Math.round(data.current.wind_kph / 3.6)
    document.querySelector(".main-today__icon").src = data.current.condition.icon
    
    document.querySelector(".page__container").style.display = "flex"

    // for map
    coordinates = `${data.location.lon},${data.location.lat}`
    getMap()
}

// map

function getMap() {
    let size
    if (window.innerWidth <= 768) {
        size = "550,142"
    } else {
        size = "350,350"
    }
    
    loader.style.display = "block"
    map.style.display = "none"
            
    map.src = `https://static-maps.yandex.ru/v1?ll=${coordinates}&z=7&size=${size}&apikey=${mapApikey}`
    
    map.onload = () => {
        loader.style.display = "none";
        map.style.display = "block";
    }
}

let currentViewportWidth = window.innerWidth > 768 ? 'wide' : 'narrow'
function debouncedUpdateMap() {
    const newViewportWidth = window.innerWidth > 768 ? 'wide' : 'narrow'
    if (newViewportWidth !== currentViewportWidth) {
        currentViewportWidth = newViewportWidth
        getMap()
    }
}
window.addEventListener('resize', () => debouncedUpdateMap())

// by hours

const hourlyCards = document.querySelector(".today__hourly")
const templateHourly = document.querySelector("#template-hourly")

for (let i = 0; i < 8; i++) {
    const item = templateHourly.content.cloneNode(true)
    hourlyCards.append(item)
}

async function getWeatherHourly(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${city}`
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    const hourlyTemps = document.querySelectorAll(".hourly__temp")
    const hourlyTimes = document.querySelectorAll(".hourly__time")
    const hourlyIcons = document.querySelectorAll(".hourly__icon")
    
    const currentHour = +data.location.localtime.slice(11, 13)

    for (let i = 0; i < 8; i++) {
        hourlyTimes[i].innerHTML = data.forecast.forecastday[0].hour[i * 3].time.slice(11, 17)
        hourlyTemps[i].innerHTML = Math.round(data.forecast.forecastday[0].hour[i * 3].temp_c)
        hourlyIcons[i].src = data.forecast.forecastday[0].hour[i * 3].condition.icon
    }
}

// week

const weekCards = document.querySelector(".week")
const templateWeek = document.querySelector("#template-week")

for (let i = 0; i < 3; i++) {
    const item = templateWeek.content.cloneNode(true)
    weekCards.append(item)
}

async function getWeatherWeek(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${city}&days=3`
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    const weekDates = document.querySelectorAll(".week__date")
    const weekTimes = document.querySelectorAll(".week__time")
    const weekIcons = document.querySelectorAll(".week__icon")
    const weekTemps = document.querySelectorAll(".week__temp")
    const weekPressures = document.querySelectorAll(".week__pressure")
    const weekWinds = document.querySelectorAll(".week__wind")
    const weekHumidities = document.querySelectorAll(".week__humidity")
    console.log(weekTimes)
        
    for (let i = 0; i < 3; i++) {
        weekDates[i].innerHTML = new Date(data.forecast.forecastday[i].date_epoch * 1000).toString().slice(0, 10)
    }
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 4; i++) {
            console.log(weekTimes[i])
            weekTimes[i + (4 * j)].innerHTML = data.forecast.forecastday[j].hour[i * 6].time.slice(11, 17)
            weekIcons[i + (4 * j)].src = data.forecast.forecastday[j].hour[i * 6].condition.icon
            weekTemps[i + (4 * j)].innerHTML = Math.round(data.forecast.forecastday[j].hour[i * 6].temp_c)
            weekPressures[i + (4 * j)].innerHTML = Math.round(data.forecast.forecastday[j].hour[i * 6].pressure_mb / 1.333)
            weekWinds[i + (4 * j)].innerHTML = Math.round(data.forecast.forecastday[j].hour[i * 6].wind_kph / 3.6)
            weekHumidities[i + (4 * j)].innerHTML = Math.round(data.forecast.forecastday[j].hour[i * 6].humidity)
        } 
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