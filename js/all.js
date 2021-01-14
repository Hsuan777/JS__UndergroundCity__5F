const googleScript = `https://script.googleusercontent.com/macros/echo?user_content_key=phrVdYu0Q3XqAxTa4cq72gaVj8KRw8fwK8GkMW8L9IF_WGg8NmQCIVDWpRYBpfh-fXZ7nRVcoyTFky8F32I5fLKI9_cAMlzPm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnIoD3KqIE4zKFslomcrc1HsTxzETLkHyqKpbVKR7SUZ7yF9sZFB2hWkNIdwvNj24Yg3NRYZ4K8s_vJsw0wqpxiI&lib=MsigB4MHVny8Dzc9UZJu-ZrYZRSJ0wUZU`
const areasOptions = document.querySelector('.js-areas')
const siteOther = document.querySelector('.js-siteOther')
const dottedLine = document.querySelector('.custom--dottedLine')


const searchAir = function() {
  const area =  document.querySelector('.js-area')
  const updateTime = document.querySelector('.js-updateTime')
  const siteDetail = document.querySelector('.js-siteDetail')
  // 原始資料
  let date = []
  // 區域資料
  let areas = []
  let areasStr = '<option selected>-請選擇地區-</option>'
  // 站點資料
  let sitesAry = []
  let vm = this
  area.textContent = '讀取中'
  this.getData = () => {
    vm.loadingFn(true)
    fetch( googleScript )
    .then( response => {
      return response.json(); 
    })
    .then( jsonData => {
      date = jsonData
      date.forEach( item => {
        if ( areas.indexOf(item.County) === -1 ) {
          areas.push( item.County ) 
          areasStr += `<option value="${item.County}">${item.County}</option>`
          updateTime.innerHTML = `${item.PublishTime} 更新`
        }
      })
      vm.loadingFn(false)
      areasOptions.innerHTML = areasStr
      area.textContent = '請選擇地區'
    })
  }
  this.colorFn = (num) => {
    if ( num >=0 && num <=50 ) {
      return 'bg-success'
    } else if ( num >=51 && num <=100 ) {
      return 'bg-ordinary'
    } else if ( num >= 101 && num <= 150 ) {
      return 'bg-wraning'
    } else if ( num >= 151 && num <= 200 ) {
      return 'bg-danger'
    } else if ( num >= 201 && num <= 300 ) {
      return 'bg-hazard'
    } else if ( num >= 301 && num <= 400 ) {
      return 'bg-peril'
    } 
  } 
  this.loadingFn = (loading) => {
    let x = 1
    if (loading) {
      setInterval(()=>{
        if (x <= 7) {
          dottedLine.style.width = `${x++}2%`
        } else {
          x = 1
        }
      }, 500)
    } else {
      clearInterval(x) 
      dottedLine.style.width = `62%`     
    }
    
  }
  this.render = (areaName) => {
    let siteDetailStr = ''
    let sitesOtherStr = ''
    let siteFirst = sitesAry.shift()
    area.textContent = areaName
    siteDetailStr = `
    <div class="col-7 text-center">
      <span class="h2 fw-bolder">${siteFirst.SiteName}</span>
    </div>
    <div class="col-5 py-4 border-start border-dark border-3 text-center ${vm.colorFn(Number(siteFirst.AQI))}">
      <sapn class="display-6 py-4 fw-bolder">${siteFirst.AQI}</sapn>
    </div>
    <div class="col px-0">
      <ul class="list-group list-group-flush border-top border-dark border-4 px-3">
        <li class="list-group-item d-flex justify-content-between border-dark py-3"> 
          <h4 class="d-inline fw-bolder mb-0">臭氧 <span>O3 (ppb)</span></h4> 
          <span class="h4 fw-weight mb-0">${siteFirst.O3}</span></li>
        <li class="list-group-item d-flex justify-content-between border-dark py-3"> 
          <h4 class="d-inline fw-bolder mb-0">懸浮微粒 <span>PM10 (μg/m³)</span></h4> 
          <span class="h4 fw-weight mb-0">${siteFirst.PM10}</span></li>
        <li class="list-group-item d-flex justify-content-between border-dark py-3"> 
          <h4 class="d-inline fw-bolder mb-0">細懸浮微粒 <span>PM2.5 (μg/m³)</span></h4> 
          <span class="h4 fw-weight mb-0">${siteFirst["PM2.5"]}</span></li>
        <li class="list-group-item d-flex justify-content-between border-dark py-3"> 
          <h4 class="d-inline fw-bolder mb-0">一氧化碳 <span>CO (ppm)</span></h4> 
          <span class="h4 fw-weight mb-0">${siteFirst.CO}</span></li>
        <li class="list-group-item d-flex justify-content-between border-dark py-3"> 
          <h4 class="d-inline fw-bolder mb-0">二氧化硫 <span>SO2 (ppb)</span></h4> 
          <span class="h4 fw-weight mb-0">${siteFirst.SO2}</span></li>
        <li class="list-group-item d-flex justify-content-between border-dark py-3"> 
          <h4 class="d-inline fw-bolder mb-0">二氧化氮 <span>NO2 (ppb)</span></h4> 
          <span class="h4 fw-weight mb-0">${siteFirst.NO2}</span></li>
      </ul>
    </div>`
    sitesAry.forEach( item => {
      sitesOtherStr += `
      <li class="js-siteLink col-6">
        <a href="#" value="${item.SiteName}" class="row justify-content-center align-items-center border border-dark border-4 text-decoration-none text-reset">
          <div class="col-7 text-center">
            <span class="h2 fw-bolder">${item.SiteName}</span>
          </div>
          <div class="col-5 py-4 border-start border-dark border-3 text-center ${vm.colorFn(Number(item.AQI))}">
            <span class="display-6 py-4 fw-bolder">${item.AQI}</span>
          </div>
        </a>
      </li>`
    })
    sitesAry.push(siteFirst)
    siteDetail.innerHTML = siteDetailStr
    siteOther.innerHTML = sitesOtherStr
    vm.addEventFn()
  }

  this.changeFn = (e) => {
    sitesAry = []
    date.forEach(item => {
      if ( item.County === e.target.value ) {
        sitesAry.push(item)
      }
    })
    vm.render(e.target.value)
    vm.addEventFn()
  }
  this.clickSite = (e) => {
    e.preventDefault()
    let newArray = []
    if (e.target.tagName === 'SPAN' ) {
      temp = e.target.parentElement.parentElement.attributes.value.nodeValue
    } else if (e.target.tagName ==='DIV') {
      temp = e.target.parentElement.attributes.value.nodeValue
    } else if (e.target.tagName === 'A') {
      temp = e.target.attributes.value.nodeValue
    }
    let firstSite = sitesAry.filter(item => item.SiteName === temp )
    let otherSite = sitesAry.filter(item => item.SiteName !== temp )
    newArray.push(...firstSite, ...otherSite)
    sitesAry = newArray
    vm.render(area.textContent)
  }
  this.addEventFn = () => {
    let siteLink = document.querySelectorAll('.js-siteLink')
    siteLink.forEach(item=>{
      item.addEventListener('click', vm.clickSite)
    })
  }
  vm.getData()
}
const searchAirFn = new searchAir()

// 監聽選單
areasOptions.addEventListener('change', searchAirFn.changeFn)
// siteOther.addEventListener('click', searchAirFn.addEventFn)