const googleScript = `https://script.googleusercontent.com/macros/echo?user_content_key=phrVdYu0Q3XqAxTa4cq72gaVj8KRw8fwK8GkMW8L9IF_WGg8NmQCIVDWpRYBpfh-fXZ7nRVcoyTFky8F32I5fLKI9_cAMlzPm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnIoD3KqIE4zKFslomcrc1HsTxzETLkHyqKpbVKR7SUZ7yF9sZFB2hWkNIdwvNj24Yg3NRYZ4K8s_vJsw0wqpxiI&lib=MsigB4MHVny8Dzc9UZJu-ZrYZRSJ0wUZU`
const areasOptions = document.querySelector('.js-areas')

const searchAir = function() {
  const area =  document.querySelector('.js-area')
  const updateTime = document.querySelector('.js-updateTime')
  const sites = document.querySelector('.js-sites')
  let date = []
  let areas = []
  let areasStr = '<option selected>-請選擇地區-</option>'
  let vm = this
  this.getData = () => {
    fetch( googleScript )
    .then( response => {
      return response.json(); 
    })
    .then( jsonData => {
      date = jsonData
      vm.render(date)
    })
  }
  this.render = ( openData ) => {
    openData.forEach( item => {
      if ( areas.indexOf(item.County) === -1 ) {
        areas.push( item.County ) 
        areasStr += `<option value="${item.County}">${item.County}</option>`
        updateTime.innerHTML = `${item.PublishTime} 更新`
      }
    })
    areasOptions.innerHTML = areasStr
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
  this.changeFn = (e) => {
    let sitesAry = []
    let sitesStr = ''
    area.textContent = e.target.value
    date.forEach(item => {
      if ( item.County === e.target.value ) {
        sitesAry.push(item)
      }
    })
    sitesAry.forEach( item => {
      console.log(item.SiteName + item.AQI)
      sitesStr += `<div class="col-4">
        <div class="row justify-content-center align-items-center border border-dark border-4">
          <div class="col-7 text-center">
            <span class="h2 fw-bolder">${item.SiteName}</span>
          </div>
          <div class="col-5 py-4 border-start border-dark border-3 text-center ${vm.colorFn(Number(item.AQI))}">
            <sapn class="display-6 py-4 fw-bolder">${item.AQI}</sapn>
          </div>
        </div>
      </div>`
    })
    sites.innerHTML = sitesStr
  }
  vm.getData()
}

const searchAirFn = new searchAir()


// 監聽選單
areasOptions.addEventListener('change', searchAirFn.changeFn)