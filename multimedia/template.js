const DATA = {
	'events': [{
		'type': 'info',
		'title': 'Еженедельный отчет по расходам ресурсов',
		'source': 'Сенсоры потребления',
		'time': '19:00, Сегодня',
		'description': 'Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.',
		'icon': 'stats',
		'data': {
			'image': 'Richdata.png'
		},
		'size': 'l'
	},
	{
		'type': 'info',
		'title': 'Дверь открыта',
		'source': 'Сенсор входной двери',
		'time': '18:50, Сегодня',
		'description': null,
		'icon': 'key',
		'size': 's'
	},
	{
		'type': 'info',
		'title': 'Уборка закончена',
		'source': 'Пылесос',
		'time': '18:45, Сегодня',
		'description': null,
		'icon': 'robot-cleaner',
		'size': 's'
	},
	{
		'type': 'info',
		'title': 'Новый пользователь',
		'source': 'Роутер',
		'time': '18:45, Сегодня',
		'description': null,
		'icon': 'router',
		'size': 's'
	},
	{
		'type': 'info',
		'title': 'Изменен климатический режим',
		'source': 'Сенсор микроклимата',
		'time': '18:30, Сегодня',
		'description': 'Установлен климатический режим «Фиджи»',
		'icon': 'thermal',
		'size': 'm',
		'data': {
			'temperature': 24,
			'humidity': 80
		}
	},
	{
		'type': 'critical',
		'title': 'Невозможно включить кондиционер',
		'source': 'Кондиционер',
		'time': '18:21, Сегодня',
		'description': 'В комнате открыто окно, закройте его и повторите попытку',
		'icon': 'ac',
		'size': 'm'
	},
	{
		'type': 'info',
		'title': 'Музыка включена',
		'source': 'Яндекс.Станция',
		'time': '18:16, Сегодня',
		'description': 'Сейчас проигрывается:',
		'icon': 'music',
		'size': 'm',
		'data': {
			'albumcover': 'https://avatars.yandex.net/get-music-content/193823/1820a43e.a.5517056-1/m1000x1000',
			'artist': 'Florence & The Machine',
			'track': {
				'name': 'Big God',
				'length': '4:31'
			},
			'volume': 80
		}
	},
	{
		'type': 'info',
		'title': 'Заканчивается молоко',
		'source': 'Холодильник',
		'time': '17:23, Сегодня',
		'description': 'Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?',
		'icon': 'fridge',
		'size': 'm',
		'data': {
			'buttons': ['Да', 'Нет']
		}
	},
	{
		'type': 'info',
		'title': 'Зарядка завершена',
		'source': 'Оконный сенсор',
		'time': '16:22, Сегодня',
		'description': 'Ура! Устройство «Оконный сенсор» снова в строю!',
		'icon': 'battery',
		'size': 's'
	},
	{
		'type': 'critical',
		'title': 'Пылесос застрял',
		'source': 'Сенсор движения',
		'time': '16:17, Сегодня',
		'description': 'Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.',
		'icon': 'cam',
		'data': {
			'image': 'get_it_from_mocks_:3.jpg'
		},
		'size': 'l'
	},
	{
		'type': 'info',
		'title': 'Вода вскипела',
		'source': 'Чайник',
		'time': '16:20, Сегодня',
		'description': null,
		'icon': 'kettle',
		'size': 's'
	}
	]
};


let container = document.querySelector('#events');
const cardTemplate = document.querySelector('#card-template');
const PROPERTIES = [{
	name: 'size',
	selector: '.card',
	neededChild: 0,
	className: 'card card__$meow'
},
{
	name: 'type',
	selector: '.card__type--top',
	neededChild: 0,
	className: 'card__type--top card__$meow'
},
{
	name: 'info',
	selector: '.card__type--bottom',
	neededChild: 1
},
{
	name: 'title',
	selector: '.card__title',
	neededChild: 1
},
{
	name: 'source',
	selector: '.card__source',
	neededChild: 1
},
{
	name: 'time',
	selector: '.card__time',
	neededChild: 1
},
{
	name: 'description',
	selector: '.card__description',
	neededChild: 0,
	optional: 1,
	innerHtml: '<p class="card--paragraph">$meow</p>'
},
{
	name: 'icon',
	selector: '.card__icon',
	neededChild: 1,
	innerHtml: '<use xlink:href="assets/$meow.svg#Events"></use>'
},
{
	name: 'data',
	selector: '.card__data',
	neededChild: 1,
	optional: 1,
	children: []
},
];

class TemplateFactory {
	
	constructor(template, properties) {
		this._template = template.content;
		this._properties = JSON.parse(JSON.stringify(properties));
		this._stringToReplace = '$meow';

	}
	_initTemplate() {
		let template = document.importNode(this._template, true);
		this._properties.forEach((prop) => {
			prop.element = template.querySelector(prop.selector);
		});
		return template;
	}

	_removeItem(item) {
		item.parentElement.removeChild(item);
	}
	renderEventData(event, dataNode) {

		let graph = dataNode.querySelector('.card__data__graph');
		let image = dataNode.querySelector('.card__data__image');
		let music = dataNode.querySelector('.card__data__music');
		let climate = dataNode.querySelector('.card__data__climate');
		let buttons = dataNode.querySelector('.card__data__buttons');

		if (event.data.type == 'graph' ) {
			graph.children[0].src = 'assets/RichData@2x-min.png'; ////temp
			graph.children[0].alt = 'RichData@2x-min.png'; 

		} else {
			this._removeItem(graph);
		}

		if (event.data.image) {
			image.children[0].src = `assets/${event.data.image}`;
			image.children[0].alt = `${event.data.image}`;
		} else {
			this._removeItem(image.parentElement);
		}


		if (event.data.temperature) {
			climate.innerHTML = `
			<div class="card__data__temperature">
				<p class="card--data-climate"> 
				Температура: <span class="card--data-climate text--bold">${event.data.temperature} С</span>
				</p>
			</div>
			<div class="card__data__humidity">
				<p class="card--data-climate"> 
					Влажность: <span class="card--data-climate text--bold">${event.data.humidity}%</span>
				</p>
			</div>`;
		} else {
			this._removeItem(climate);
		}

		if (event.data.track) {
			music.innerHTML = 
            `  <div class="music__header">
                    <div class="card__data__albumcover">
                        <img class="card__data__albumcover--img" src="${event.data.albumcover}" alt="${event.data.albumcover}">
                    </div>

                    <div class="music__main">
                        <div class="card__data__artist">
                            <p class="card--data-music-title">
                                ${event.data.artist} - ${event.data.track.name}
                            </p>
                        </div>
                        <div class="music__track">
                            <input type="range" class="music__track--range">
                            <div class="card__data__track--length music__track--length">
                                <p class="card--data-music">
                                    ${event.data.track.length}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="music__player">
                    <div class="music__icons">
                        <div class="music__icons--item">
                            <svg class="icon--music">
                                <use xlink:href="assets/Prev.svg#Events"></use>
                            </svg>
                        </div>
                        <div class="music__icons--item">
                            <svg class="icon--music icon--rotated">
                                <use xlink:href="assets/Prev.svg#Events"></use>
                            </svg>
                        </div>
                    </div>

                    <input type="range" class="music__player--range">
                    <div class="card__data__volume">
                        <p class="card--data-music">
                            ${event.data.volume}
                        </p>
                    </div>
                </div>`;
		} else {
			this._removeItem(music);
		}
        
		if (event.data.buttons) {

			let buttons = dataNode.querySelector('.card__data__buttons');
			event.data.buttons.forEach(btn => {
				buttons.innerHTML += ` <button class="card__data__buttons--btn">
                                            <span class="card--data-paragraph text--bold">
                                                ${btn}
                                            </span>
                                        </button>`;
			});

		} else {
			this._removeItem(buttons);
		}
	}
	renderContent(dataToRender) {
		dataToRender.forEach(event => {

			let template = this._initTemplate();
			this._properties.forEach((prop) => {
				if (!prop.children) {
					let element = prop.neededChild ? prop.element.children[0] : prop.element,
						inputContent = prop.innerHtml ? prop.innerHtml.replace(this._stringToReplace, event[prop.name]) : event[prop.name];

					if (prop.className) {
						element.className = prop.className.replace(this._stringToReplace, event[prop.name]);
					} else if (prop.optional) {
						if (event[prop.name]) {
							element.innerHTML = inputContent;
						} else {
							this._removeItem(prop.element);
						}
					} else {
						element.innerHTML = inputContent;
					}

				} else {
					if (event[prop.name]) {
						this.renderEventData(event, prop.element);
					} else {
						this._removeItem(prop.element);
					}
				}

			});
			container.appendChild(template.cloneNode(true));
		});

	}
}

let cardTemplateFactory = new TemplateFactory(cardTemplate, PROPERTIES);

fetch('http://127.0.0.1:3000/api/events',{
	method: 'POST',
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({type: 'info:critical'})

}).then((response)=>{
	// console.log(response.json());
	return response.json();
}).then(dataFromServer => {
	if(dataFromServer){
		console.log('getting data from server');
		cardTemplateFactory.renderContent(dataFromServer.events);
		
	}else{
		console.log('getting data from local source, server is offline');
		cardTemplateFactory.renderContent(DATA.events);
	}
		
}).catch(e=>{
	console.log('getting data from local source, server is offline');
	cardTemplateFactory.renderContent(DATA.events);
});




