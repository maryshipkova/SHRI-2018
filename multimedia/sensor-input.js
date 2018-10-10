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

    }

    _updateTrack(newCondition){
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
        this._zoomField.addEventListener('touchstart', this._resetProperties);
        this._brightnessField.addEventListener('touchstart', this._resetProperties);
        this._element.addEventListener('touchstart', this._resetConditions);
        this._element.addEventListener('gesturechange', (event) => {
            this._handleRotation(event.rotation);
            if (event.scale > 1.0) {
                this._updateProperty('scale', event.scale);
                this._updateField(this._zoomField, (event.scale * 100).toPrecision(3));
            }
        });

        element.addEventListener('touchmove', (event) => {
            event.preventDefault();
            if (event.touches.length === 1 && this._transformProperties.scale > 1.0) {

                this._calcChanges('translateX', event.touches[0].clientX);
                this._updateTrack(this._transformProperties.translateX.toPrecision(3));
                this._calcChanges('translateY', event.touches[0].clientY);
            }

        });

    }
    _calcChanges(conditionName, eventCondition) {
        if (!this._prevConditions[conditionName]) {
            this._prevConditions[conditionName] = eventCondition;
            return;
        }
        if (Math.abs(eventCondition - this._prevConditions[conditionName]) > 3) {
            let newConditionValue = (this._prevConditions[conditionName] < eventCondition) ? this._transformProperties[conditionName] + 2 : this._transformProperties[conditionName] - 2;

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

    _handleRotation(eventRotation) {
        this._calcChanges('brightness', eventRotation);
        this._updateField(this._brightnessField, this._transformProperties.brightness);

    }


}

let ImageSensorInputHandler = new sensorInputHandler(element, INITIAL_CONDITIONS, TRANSFORM_PROPERTIES, zoomField, brightnessField, translateTrack);
ImageSensorInputHandler.setEventHandlers();