



Object.extend(Event,{
_domReady:function(){
if(arguments.callee.done)return;
arguments.callee.done=true;

if(this._timer)clearInterval(this._timer);

this._readyCallbacks.each(function(f){f()});
this._readyCallbacks=null;
},
onDOMReady:function(f){
if(!this._readyCallbacks){
var domReady=this._domReady.bind(this);

if(document.addEventListener)
document.addEventListener("DOMContentLoaded",domReady,false);

/*@cc_on @*/
/*@if (@_win32)
    document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
    document.getElementById("__ie_onload").onreadystatechange = function() {
        if (this.readyState == "complete") domReady(); 
    };
/*@end @*/


if(/WebKit/i.test(navigator.userAgent)){
this._timer=setInterval(function(){
if(/loaded|complete/.test(document.readyState))domReady();
},10);
}

Event.observe(window,'load',domReady);
Event._readyCallbacks=[];
}
Event._readyCallbacks.push(f);
}
});


if(typeof(AC)=="undefined")AC={};

AC.decorateSearchInput=function(field,options){

var searchField=$(field);
var standIn=null;

var results=0;
var placeholder='';
var autosave='';

if(options){

if(options.results){results=options.results;}
if(options.placeholder){placeholder=options.placeholder;}
if(options.autosave){autosave=options.autosave;}

}

if(AC.Detector.isWebKit()){

searchField.setAttribute('type','search');
if(!searchField.getAttribute('results')){
searchField.setAttribute('results',results);
}

if(null!=placeholder){
searchField.setAttribute('placeholder',placeholder);
searchField.setAttribute('autosave',autosave);
}

}else{




searchField.setAttribute('autocomplete','off');





standIn=document.createElement('input');
searchField.parentNode.replaceChild(standIn,searchField)

var left=document.createElement('span');
Element.addClassName(left,'left');

var right=document.createElement('span');
Element.addClassName(right,'right');

var reset=document.createElement('div');
Element.addClassName(reset,'reset');

var wrapper=document.createElement('div');
Element.addClassName(wrapper,'search-wrapper');

var alreadyHasPlaceholder=field.value==placeholder;
var isEmpty=field.value.length==0;

if(alreadyHasPlaceholder||isEmpty){
searchField.value=placeholder;
Element.addClassName(wrapper,'blurred');
Element.addClassName(wrapper,'empty');
}

wrapper.appendChild(left);
wrapper.appendChild(searchField);
wrapper.appendChild(right);
wrapper.appendChild(reset);

var focus=function(){

var blurred=Element.hasClassName(wrapper,'blurred');



if(searchField.value==placeholder&&blurred){
searchField.value='';
}

Element.removeClassName(wrapper,'blurred');
}
Event.observe(searchField,'focus',focus);

var blur=function(){

if(searchField.value==''){
Element.addClassName(wrapper,'empty');
searchField.value=placeholder;
}

Element.addClassName(wrapper,'blurred');
}
Event.observe(searchField,'blur',blur);


var toggleReset=function(){

if(searchField.value.length>=0){
Element.removeClassName(wrapper,'empty');
}
}
Event.observe(searchField,'keydown',toggleReset);


var resetField=function(){
return(function(evt){

var escaped=false;

if(evt.type=='keydown'){
if(evt.keyCode!=27){
return;
}else{
escaped=true;
}
}

searchField.blur();
searchField.value='';
Element.addClassName(wrapper,'empty');
searchField.focus();

})
}
Event.observe(reset,'mousedown',resetField());
Event.observe(searchField,'keydown',resetField());

if(standIn){
standIn.parentNode.replaceChild(wrapper,standIn);
}

}
}







var Element2={};
Element2.Methods={

getInnerDimensions:function(element){

element=$(element);
var d=Element.getDimensions(element);

var innerHeight=d.height;
var styleOf=Element.getStyle;
innerHeight-=styleOf(element,'border-top-width')&&styleOf(element,'border-top-width')!='medium'?parseInt(styleOf(element,'border-top-width'),10):0;
innerHeight-=styleOf(element,'border-bottom-width')&&styleOf(element,'border-bottom-width')!='medium'?parseInt(styleOf(element,'border-bottom-width'),10):0;
innerHeight-=styleOf(element,'padding-top')?parseInt(styleOf(element,'padding-top'),10):0;
innerHeight-=styleOf(element,'padding-bottom')?parseInt(styleOf(element,'padding-bottom'),10):0;

var innerWidth=d.width;
innerWidth-=styleOf(element,'border-left-width')&&styleOf(element,'border-left-width')!='medium'?parseInt(styleOf(element,'border-left-width'),10):0;
innerWidth-=styleOf(element,'border-right-width')&&styleOf(element,'border-right-width')!='medium'?parseInt(styleOf(element,'border-right-width'),10):0;
innerWidth-=styleOf(element,'padding-left')?parseInt(styleOf(element,'padding-left'),10):0;
innerWidth-=styleOf(element,'padding-right')?parseInt(styleOf(element,'padding-right'),10):0;

return{width:innerWidth,height:innerHeight};
},


getOuterDimensions:function(element){
element=$(element);
var clone=element.cloneNode(true);

document.body.appendChild(clone);
Element.setStyle(clone,{position:"absolute",visibility:"hidden"});
var d=Element.getDimensions(clone);

var outerHeight=d.height;
var styleOf=Element.getStyle;
outerHeight+=styleOf(clone,'margin-top')?parseInt(styleOf(clone,'margin-top'),10):0;
outerHeight+=styleOf(clone,'margin-bottom')?parseInt(styleOf(clone,'margin-bottom'),10):0;

var outerWidth=d.width;
outerWidth+=styleOf(clone,'margin-left')?parseInt(styleOf(clone,'margin-left'),10):0;
outerWidth+=styleOf(clone,'margin-right')?parseInt(styleOf(clone,'margin-right'),10):0;

Element.remove(clone);

return{width:outerWidth,height:outerHeight};
},

removeAllChildNodes:function(element){
element=$(element);
if(!element){return;}

while(element.hasChildNodes()){
element.removeChild(element.lastChild);
}
}

};

Object.extend(Element,Element2.Methods);


