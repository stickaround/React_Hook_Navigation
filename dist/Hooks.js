"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var core_1 = require("@react-navigation/core");
function useNavigation() {
    return react_1.useContext(core_1.NavigationContext);
}
exports.useNavigation = useNavigation;
function useNavigationParam(paramName) {
    return useNavigation().getParam(paramName);
}
exports.useNavigationParam = useNavigationParam;
function useNavigationState() {
    return useNavigation().state;
}
exports.useNavigationState = useNavigationState;
function useNavigationKey() {
    return useNavigation().state.key;
}
exports.useNavigationKey = useNavigationKey;
function useNavigationEvents(handleEvt) {
    var navigation = useNavigation();
    react_1.useEffect(function () {
        var subsA = navigation.addListener('action', handleEvt);
        var subsWF = navigation.addListener('willFocus', handleEvt);
        var subsDF = navigation.addListener('didFocus', handleEvt);
        var subsWB = navigation.addListener('willBlur', handleEvt);
        var subsDB = navigation.addListener('didBlur', handleEvt);
        return function () {
            subsA.remove();
            subsWF.remove();
            subsDF.remove();
            subsWB.remove();
            subsDB.remove();
        };
    }, 
    // For TODO consideration: If the events are tied to the navigation object and the key
    // identifies the nav object, then we should probably pass [navigation.state.key] here, to
    // make sure react doesn't needlessly detach and re-attach this effect. In practice this
    // seems to cause troubles
    undefined
    // [navigation.state.key]
    );
}
exports.useNavigationEvents = useNavigationEvents;
var emptyFocusState = {
    isFocused: false,
    isBlurring: false,
    isBlurred: false,
    isFocusing: false,
};
var didFocusState = tslib_1.__assign({}, emptyFocusState, { isFocused: true });
var willBlurState = tslib_1.__assign({}, emptyFocusState, { isBlurring: true });
var didBlurState = tslib_1.__assign({}, emptyFocusState, { isBlurred: true });
var willFocusState = tslib_1.__assign({}, emptyFocusState, { isFocusing: true });
var getInitialFocusState = function (isFocused) {
    return isFocused ? didFocusState : didBlurState;
};
function focusStateOfEvent(eventName) {
    switch (eventName) {
        case 'didFocus':
            return didFocusState;
        case 'willFocus':
            return willFocusState;
        case 'willBlur':
            return willBlurState;
        case 'didBlur':
            return didBlurState;
        default:
            return null;
    }
}
function useFocusState() {
    var navigation = useNavigation();
    var isFocused = navigation.isFocused();
    var _a = react_1.useState(getInitialFocusState(isFocused)), focusState = _a[0], setFocusState = _a[1];
    function handleEvt(e) {
        var newState = focusStateOfEvent(e.type);
        newState && setFocusState(newState);
    }
    useNavigationEvents(handleEvt);
    return focusState;
}
exports.useFocusState = useFocusState;
