const element = document.querySelectorAll('.card__data__image--img')[1];
const zoomField = document.querySelectorAll('.settings--zoom')[1];
const brightnessField = document.querySelectorAll('.settings--brightness')[1];

const TRANSFORM_PROPERTIES = {
    'translateX': 0,
    'translateY': 0,
    'scale': 1.0,
    'brightness': 100
}
const INITIAL_CONDITIONS = {
    'translateX': "",
    'translateY': "",
    'rotation': "",
}
class sensorInputHandler {
    constructor(element, INITIAL_CONDITIONS, transformProperties, zoomField, brightnessField) {
        this._element = element;
        this._transformProperties = transformProperties;
        this._prevConditions = INITIAL_CONDITIONS;
        this._startProperties = JSON.parse(JSON.stringify(transformProperties));
        this._zoomField = zoomField;
        this._brightnessField = brightnessField;

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
        this._zoomField.addEventListener('touchstart', this._resetProperties);
        this._brightnessField.addEventListener('touchstart', this._resetProperties);
        this._element.addEventListener('touchstart', this._resetConditions);
        this._element.addEventListener('gesturechange', (event) => {
            this._handleRotation(event.rotation);
            if(event.scale > 1.0){
                this._updateProperty('scale', event.scale);
                this._updateField(this._zoomField,(event.scale*100).toPrecision(3));
            }
        });


        element.addEventListener('touchmove', (event) => {
            event.preventDefault();
            if (event.touches.length === 1) { // && transformProperties.scale > 1.0
                if (!this._prevConditions.translateX || !this._prevConditions.translateY) {
                    this._prevConditions.translateX =  event.touches[0].clientX;
                    this._prevConditions.translateY =  event.touches[0].clientY;
                    return;
                }
                // let newXValue = this._calcChanges('translateX', event.touches[0].clientX);
                // console.log('X', newXValue, event.touches[0].clientX, this._prevConditions.translateX);
                // if (newXValue) {
                //     this._updateProperty('translateX', this._prevConditions.translateX);
                // }
                // let newYValue = this._calcChanges('translateY', event.touches[0].clientY);
                // console.log('X', newXValue);
                // if (newYValue) {
                //     this._updateProperty('translateY', newYValue);
                // }

                let clientX = event.touches[0].clientX;
                let clientY = event.touches[0].clientY;
                if (! this._prevConditions.translateX  || !this._prevConditions.translateY) {
                     this._prevConditions.translateX  = clientX;
                    this._prevConditions.translateY = clientY;
                    return;
                }
                // console.log(this._transformProperties);
                if (Math.abs(clientX -  this._prevConditions.translateX ) > 3) {
                    this._updateProperty('translateX', ( this._prevConditions.translateX  < clientX) ? this._transformProperties.translateX + 2 : this._transformProperties.translateX - 2);
                    this._prevConditions.translateX  = clientX;
                }
                if (Math.abs(clientY - this._prevConditions.translateY) > 3) {
                    this._updateProperty('translateY', (this._prevConditions.translateY < clientY) ? this._transformProperties.translateY + 2 : this._transformProperties.translateY - 2);
                    this._prevConditions.translateY  = clientY;
                }

            }

        });
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

    _handleRotation(eventRotation) {
        if (!this._prevConditions.rotation) {
            this._prevConditions.rotation = eventRotation;
            return;
        }
        if (Math.abs(eventRotation - this._prevConditions.rotation) > 3) {
            this._updateProperty('brightness', (this._prevConditions.rotation < eventRotation) ? this._transformProperties.brightness + 2 : this._transformProperties.brightness - 2);
            this._updateField(this._brightnessField, this._transformProperties.brightness);
            this._prevConditions.rotation  = eventRotation;
        }
        // let newBrightnessValue = this._calcChanges('rotation', eventRotation);
        // if (newBrightnessValue) {
        //     this._updateProterty('brightness', newBrightnessValue)
        //     this._updateField(this._brightnessField, newBrightnessValue);
        // }
    }

    _calcChanges(conditionName, eventCondition) {
        if (Math.abs(eventCondition - this._prevConditions[conditionName]) > 3) {
            let newConditionValue = (this._prevConditions[conditionName] < eventCondition) ? this._prevConditions[conditionName] + 2 : this._prevConditions[conditionName] - 2;
            this._prevConditions[conditionName] = eventCondition;
            return newConditionValue;
        }
    }
}

let ImageSensorInputHandler = new sensorInputHandler(element, INITIAL_CONDITIONS, TRANSFORM_PROPERTIES, zoomField, brightnessField);
ImageSensorInputHandler.setEventHandlers();