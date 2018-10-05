const DATA = {
    "events": [{
            "type": "info",
            "title": "Еженедельный отчет по расходам ресурсов",
            "source": "Сенсоры потребления",
            "time": "19:00, Сегодня",
            "description": "Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.",
            "icon": "stats",
            "data": {
                "image": "RichData.png"
            },
            "size": "l"
        },
        {
            "type": "info",
            "title": "Дверь открыта",
            "source": "Сенсор входной двери",
            "time": "18:50, Сегодня",
            "description": null,
            "icon": "key",
            "size": "s"
        },
        {
            "type": "info",
            "title": "Уборка закончена",
            "source": "Пылесос",
            "time": "18:45, Сегодня",
            "description": null,
            "icon": "robot-cleaner",
            "size": "s"
        },
        {
            "type": "info",
            "title": "Новый пользователь",
            "source": "Роутер",
            "time": "18:45, Сегодня",
            "description": null,
            "icon": "router",
            "size": "s"
        },
        {
            "type": "info",
            "title": "Изменен климатический режим",
            "source": "Сенсор микроклимата",
            "time": "18:30, Сегодня",
            "description": "Установлен климатический режим «Фиджи»",
            "icon": "thermal",
            "size": "m",
            "data": {
                "temperature": 24,
                "humidity": 80
            }
        },
        {
            "type": "critical",
            "title": "Невозможно включить кондиционер",
            "source": "Кондиционер",
            "time": "18:21, Сегодня",
            "description": "В комнате открыто окно, закройте его и повторите попытку",
            "icon": "ac",
            "size": "m"
        },
        {
            "type": "info",
            "title": "Музыка включена",
            "source": "Яндекс.Станция",
            "time": "18:16, Сегодня",
            "description": "Сейчас проигрывается:",
            "icon": "music",
            "size": "m",
            "data": {
                "albumcover": "https://avatars.yandex.net/get-music-content/193823/1820a43e.a.5517056-1/m1000x1000",
                "artist": "Florence & The Machine",
                "track": {
                    "name": "Big God",
                    "length": "4:31"
                },
                "volume": 80
            }
        },
        {
            "type": "info",
            "title": "Заканчивается молоко",
            "source": "Холодильник",
            "time": "17:23, Сегодня",
            "description": "Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?",
            "icon": "fridge",
            "size": "m",
            "data": {
                "buttons": ["Да", "Нет"]
            }
        },
        {
            "type": "info",
            "title": "Зарядка завершена",
            "source": "Оконный сенсор",
            "time": "16:22, Сегодня",
            "description": "Ура! Устройство «Оконный сенсор» снова в строю!",
            "icon": "battery",
            "size": "s"
        },
        {
            "type": "critical",
            "title": "Пылесос застрял",
            "source": "Сенсор движения",
            "time": "16:17, Сегодня",
            "description": "Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.",
            "icon": "cam",
            "data": {
                "image": "image.jpg"
            },
            "size": "l"
        },
        {
            "type": "info",
            "title": "Вода вскипела",
            "source": "Чайник",
            "time": "16:20, Сегодня",
            "description": null,
            "icon": "kettle",
            "size": "s"
        }
    ]
}

let container = document.querySelector('#events');
const cardTemplate = document.querySelector('#card-template');
// const properties = {
//     card: 
//     title : '.card__title',
//     source: 
// }

class TemplateFactory{
    constructor(template){
        this._template = template.content;
        // this._properties = properties;
    }

    removeItem(item){
        item.parentElement.removeChild(item);
    }
    renderEventData(event, dataNode){

        if(event.data.image){
            let image = dataNode.querySelector('.card__data__image');
            image.innerHTML = `<img class="card__data__image--img" src="assets/${event.data.image}" alt="${event.data.image}">`;
        }
        else if(event.data.temperature){
            let temperature = dataNode.querySelector('.card__data__temperature');
            let humidity = dataNode.querySelector('.card__data__humidity');
            // dataNode.innerHTML=`<pre>${event.data}</pre>`;
         
            temperature.children[0].innerHTML = `Температура: <span class="card--data-climate--bold">${event.data.temperature} С</span>`;
            humidity.children[0].innerHTML =  `Влажность: <span class="card--data-climate--bold">${event.data.humidity}%</span>`;
            console.log(temperature.children[0]);
        }
        else if(event.data.track){
            let track = dataNode.querySelector('.card__data__track');
            // dataNode.innerHTML=`<pre>${event.data}</pre>`;
        }
        else if(event.data.buttons){
            let buttons = dataNode.querySelector('.card__data__buttons');
            // dataNode.innerHTML=`<pre>${event.data}</pre>`;
        }
    }
    renderContent(dataToRender){
        dataToRender.forEach(event => {
            //Create a new node, based on the template:
            let template = document.importNode(this._template, true);
            // console.log(template.childNodes);
            let card = template.querySelector('.card'),
            title = template.querySelector('.card__title'),
            source = template.querySelector('.card__source'),
            time = template.querySelector('.card__time'),
            description = template.querySelector('.card__description'),
            icon = template.querySelector('.card__icon'),
            data = template.querySelector('.card__data');
            ////////////////let card = template.content.querySelector('.card'), +=cardname
            card.className = `card card__${event.size}`;
            icon.children[0].innerHTML = `<use xlink:href="assets/${event.icon}.svg#Events"></use>`;
            title.children[0].textContent = event.title;
            source.children[0].textContent = event.source;
            time.children[0].textContent = event.time;
        
            if(event.description){
                description.children[0].textContent = event.description;
            }else{
                this.removeItem(description);
            }

            if(event.data){
                this.renderEventData(event, data);
                // console.log(event.data);        
            }else{
                this.removeItem(data);
            }
            container.appendChild(template.cloneNode(true));
        
        });
    }
}

let cardTemplateFactory = new TemplateFactory(cardTemplate)

cardTemplateFactory.renderContent(DATA.events);