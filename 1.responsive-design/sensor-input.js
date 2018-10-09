const element = document.querySelectorAll('.card__data__image--img')[1];
const zoomField = document.querySelectorAll('.settings--zoom')[1];
const brightnessField = document.querySelectorAll('.settings--brightness')[1];
const translateTrack = document.querySelector('.settings--range');

const TRANSFORM_PROPERTIES = {
    'translateX': 0,
    'translateY': 0,
    'scale': 1.0,
    'brightness': 100
}
const INITIAL_CONDITIONS = {
    'translateX': "",
    'translateY': "",
    'brightness': "",
}
class sensorInputHandler {

    constructor(element, INITIAL_CONDITIONS, transformProperties, zoomField, brightnessField, translateTrack) {

        this._element = element;
        this._transformProperties = transformProperties;
        this._prevConditions = INITIAL_CONDITIONS;
        this._startProperties = JSON.parse(JSON.stringify(transformProperties));
        this._zoomField = zoomField;
        this._brightnessField = brightnessField;
        this._translateTrack = translateTrack;
        this._pointerEvents = [];
    }

    _updateTrack(newCondition) {

        this._translateTrack.value = parseInt(newCondition);
    }
    _updateField(field, newCondition) {

        field.innerHTML = newCondition;
    }
    _updateView() {

        this._element.style.transform = `translateX(${this._transformProperties.translateX}%) translateY(${this._transformProperties.translateY}%) scale(${this._transformProperties.scale})`;
        this._element.style.filter = `brightness(${this._transformProperties.brightness}%)`;
    }

    _updateProperty(property, value) {

        this._transformProperties[property] = value;
        this._updateView();
    }
    setEventHandlers() {
        // this._zoomField.addEventListener('touchstart', this._resetProperties);
        // this._brightnessField.addEventListener('touchstart', this._resetProperties);
        // this._element.addEventListener('touchstart', this._resetConditions);
        // this._element.addEventListener('gesturechange', (event) => {
        //     this._handleTouchRotation(event.rotation);
        //     if (event.scale > 1.0) {
        //         this._updateProperty('scale', event.scale);
        //         this._updateField(this._zoomField, (event.scale * 100).toPrecision(3));
        //     }
        // });

        // element.addEventListener('touchmove', (event) => {
        //     if (event.touches.length === 1 ){
        //         this._handleTranslation('translateX',event.touches[0].clientX);
        //         this._handleTranslation('translateY',event.touches[0].clientY);
        //     }
        // });
        element.addEventListener('pointerenter', (event) => {

            event.currX = event.clientX;
            event.currY = event.clientY;
            this._pointerEvents.push(event);
        });
        element.addEventListener('pointerleave', (event) => {

            this._pointerEvents = this._pointerEvents.filter(e => e.pointerId !== event.pointerId);
        });

        element.addEventListener('pointermove', (event) => {

            let currEvent = this._pointerEvents.find(e => e.pointerId === event.pointerId);
            currEvent.prevX = currEvent.currX;
            currEvent.prevY = currEvent.currY;
            currEvent.currX = event.clientX;
            currEvent.currY = event.clientY;
            // console.log(currEvent.prevX, currEvent.prevY, currEvent.currX, currEvent.currY)
            this._handlePointerMove(event)
        });

    }
    _handleTranslation(translationName, translationValue) {

        this._calcChanges(translationName, translationValue);
        this._updateTrack(this._transformProperties[translationName].toPrecision(3));
    }

    _handlePointerMove(event) {

        event.preventDefault();
        // console.log(event)
        if (this._pointerEvents.length === 1) {
            this._calcChanges('translateX', event.clientX);
        } else if (this._pointerEvents.length === 2) {
            let event1 = this._pointerEvents[0],
                event2 = this._pointerEvents[1];

            let currDestance = this._calcDistance(event1.currX, event1.currY, event2.currX, event2.currY),
                prevDistance = this._calcDistance(event1.prevX, event1.prevY, event2.prevX, event2.prevY);


            this._handlePointerRotation(event1, event2);


            if (Math.abs(currDestance - prevDistance) > 2) {
                this._handleScaling(prevDistance, currDestance);
            } else {
            this._handlePointerRotation(event1, event2);
            }

        }

    }
    _calcDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    _handleScaling(prevDistance, currDestance) {

        if (currDestance > prevDistance) {
            this._updateProperty('scale', this._transformProperties.scale + 0.1);
        } else if (currDestance < prevDistance && this._transformProperties.scale >= 1.1) {
            this._updateProperty('scale', this._transformProperties.scale - 0.1);
        }
        this._updateField(this._zoomField, (this._transformProperties.scale * 100).toPrecision(3));
    }

    _calcAngleFromTriangle(A, B, C) {
        return (Math.pow(A, 2) + Math.pow(B, 2) - Math.pow(C, 2)) / (2 * A * B);
    }

    _handlePointerRotation(point1, point2) {
        // this._updateField(this._zoomField, 'i');
        let circleCenter = {
            'x': Math.round((point1.currX + point2.currX) / 2),
            'y': Math.round((point1.currY + point2.currY) / 2)
        }
        // this._updateField(this._zoomField, 'circleCenter');
        let abscissaPoint = {
            'x': circleCenter.x * 2,
            'y': circleCenter.y
        }
        // this._updateField(this._zoomField, 'abscissaPoint');
        // this._updateField(this._brightnessField, 'abscissaPoint');
        // console.log(circleCenter, abscissaPoint);
        let point1CurrAngle = this._calcAngleFromTriangle(
                circleCenter.x, // distance between center and point on abscissa axis
                this._calcDistance(circleCenter.x, circleCenter.y, point1.currX, point1.currY),
                this._calcDistance(abscissaPoint.x, abscissaPoint.y, point1.currX, point1.currY)
            ),
            point1PrevAngle = this._calcAngleFromTriangle(
                circleCenter.x, // distance between center and point on abscissa axis
                this._calcDistance(circleCenter.x, circleCenter.y, point1.prevX, point1.prevY),
                this._calcDistance(abscissaPoint.x, abscissaPoint.y, point1.prevX, point1.prevY),
            );

        let point1CurrSin = Math.sqrt(1-Math.pow(point1CurrAngle,2));

        if ( (point1CurrSin >=0 && point1CurrAngle >= point1PrevAngle) || (point1CurrSin <=0 && point1CurrAngle <= point1PrevAngle) ) {
            this._updateProperty('brightness', this._transformProperties.brightness+1);
          
        } else{
         
            this._updateProperty('brightness', this._transformProperties.brightness-1);
            this._updateField(this._brightnessField, this._transformProperties.brightness);
        }
        this._updateField(this._brightnessField, this._transformProperties.brightness);
        this._updateField(this._brightnessField, this._transformProperties.brightness);
    }

    _calcChanges(conditionName, eventCondition) {

        if (!this._prevConditions[conditionName]) {
            this._prevConditions[conditionName] = eventCondition;
            return;
        }
        if (Math.abs(eventCondition - this._prevConditions[conditionName]) > 5) {
            let newConditionValue = (this._prevConditions[conditionName] < eventCondition) ? this._transformProperties[conditionName] + 5 : this._transformProperties[conditionName] - 5;

            this._updateProperty(conditionName, newConditionValue);
            this._prevConditions[conditionName] = eventCondition;

        }
    }

    _resetProperties() {

        _updateField(this._zoomField, 100);
        _updateField(this._brightnessField, 100);
        for (let prop in this._transformProperties) {
            this._updateProperty(prop, this._startProperties[prop]);
        }
    }
    _resetConditions() {

        for (let prop in this._prevConditions) {
            this._prevConditions[prop] = '';
        }
    }

    _handleTouchRotation(eventRotation) {

        this._calcChanges('brightness', eventRotation);
        this._updateField(this._brightnessField, this._transformProperties.brightness);

    }


}

let ImageSensorInputHandler = new sensorInputHandler(element, INITIAL_CONDITIONS, TRANSFORM_PROPERTIES, zoomField, brightnessField, translateTrack);
ImageSensorInputHandler.setEventHandlers();