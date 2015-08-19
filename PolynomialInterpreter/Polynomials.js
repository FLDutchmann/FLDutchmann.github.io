
var XTerm = function(factor, exponent) {
	this.factor = factor;
	this.exponent = exponent;
}

XTerm.prototype.mult = function(n){
	if(n instanceof XTerm){
		this.exponent += n.exponent;
		this.factor *= n.factor;
	} else if (typeof n === typeof 3){
		this.factor *= n;
	} else if (Number(n) === NaN){ //Screw Logic, NaN !== NaN => true, NaN === NaN => false
		this.factor *= Number(n);
	}else throw "Undefined XTerm Multiplication";
}

XTerm.mult = function(n1, n2){
	var exponent = n1.exponent + n2.exponent;
	var factor = n1.factor * n2.factor;
	return new XTerm(factor, exponent);
}

XTerm.prototype.add = function(n) {
	if (n instanceof XTerm){
		if(n.exponent === this.exponent){
			this.factor += n.factor;
		}
	} else if (typeof n === typeof 3 && this.exponent === 0){
		this.factor += n;
	} else if (Number(n) === NaN && this.exponent === 0){
		this.factor += Number(n);
	}
}

XTerm.add = function(n1, n2){
	if(n1.exponent === n2.exponent){
		n2.factor += n1.factor;
	}
	return n2;
}

XTerm.prototype.get = function() {
	return new XTerm(this.factor, this.exponent);
}


var Polynomial = function (XTerms){
	this.XTerms = XTerms;
}

Polynomial.prototype.add = function(pol){
	var len = Math.max(this.XTerms.length, pol.XTerms.length);
	for(var i = 0; i < len; i++){
		if(this.XTerms[i] === undefined){
			this.XTerms[i] = pol.XTerms[i];
		} else {
			this.XTerms[i].add(pol.XTerms[i]);
		}
	}
}

Polynomial.prototype.mult = function(pol) {
	var newXTerms = [];
	var degree = pol.XTerms.length-1 + this.XTerms.length-1;
	for(var i = 0; i <= degree; i++){
		newXTerms.push(new XTerm(0, i));
	}

	for(var i = 0; i < this.XTerms.length; i++){
		for(var j = 0; j < pol.XTerms.length; j++){
			newXTerms[i+j].add(XTerm.mult(this.XTerms[i], pol.XTerms[j]));
		}
	}
	this.XTerms = newXTerms;
}

Polynomial.prototype.pow = function(n) {
	var xTerms = [];
	for(var i = 0; i < this.XTerms.length; i++){
		xTerms[i] = new XTerm(this.XTerms[i].factor, this.XTerms[i].exponent);
	}

	var pol = new Polynomial(xTerms);
	pol = Polynomial.recPow(pol, n);
	this.XTerms = pol.XTerms;
}

Polynomial.recPow = function(pol, n) {
	if(n === 0){
		return new Polynomial([new XTerm(1, 0)]);
	}

	if(n === 1){
		return pol.get();
	}
	if(n % 2 === 0){
		var temp = Polynomial.recPow(pol, n/2);
		temp.mult(temp);
		return temp;
	}

	if(n % 2 === 1){
		var temp = Polynomial.recPow(pol, (n-1)/2);
		console.log(temp.toString());
		temp.mult(temp);
		console.log(pol.toString());
		console.log(temp.toString());
		temp.mult(pol);
		return temp;
	}
}

Polynomial.prototype.get = function() {
	var XTerms = [];
	for(var i = 0; i < this.XTerms.length; i++){
		XTerms.push(this.XTerms[i].get());
	}
	return new Polynomial(XTerms);
}

var isXTermTest = function(str){
	if(!isNaN(str) || !isNaN(str.replace("x", "")) || str === "x" ){
		return true;
	}
	var exp = str.split("x^")[1];
	str = str.replace("x^", "");
	if(!isNaN(str) && exp % 1 === 0){
		return true;
	}
	return false;
}

var isXTerm = function(str){
	var ans;
	try{
		ans = isXTermTest(str);
	} catch (e) {
		return false;
	}

	return ans;
}

var interpretXTerm = function(str){
	var factor;
	var exponent;
	if(!isNaN(str)){
		exponent = 0;
		factor = Number(str);
	} else if (str === "x") {
		exponent = 1;
		factor = 1;
	} else if (!isNaN(str.replace("x", ""))){
		exponent = 1;
		factor = Number(str.replace("x", ""));
	} else {
		str = str.split("x^");
		factor = str[0] === "" ? 1 : Number(str[0]);
		exponent = Number(str[1]);
	}

	return new XTerm (factor, exponent);
}

var isSumOfProducts = function(str){
	str = str.split("+");
	for(var i = 0; i < str.length; i++){
		if(!isXTerm(str[i])){
			return false;
		}
	}
	return true;
}

var interpretSumOfProducts = function(str) {
	str = str.split("+");
	var xTerms = [];
	for(var i = 0; i < str.length; i++){
		var xTerm = interpretXTerm(str[i]);
		if(xTerms[xTerm.exponent] === undefined){
			xTerms[xTerm.exponent] = xTerm;
		} else {
			xTerms[xTerm.exponent].add(xTerm);
		}
	}

	for(var i = 0; i < xTerms.length; i++){
		if(xTerms[i] === undefined) {
			xTerms[i] = new XTerm(0, i);
		}
	}

	return new Polynomial(xTerms);
}

var getCharIndicesBrackets = function(str, char) {
	var bracketLevel = 0;
	var indices = [];
	for(var i = 0; i < str.length; i++){
		if(str[i] === "("){
			bracketLevel++;
		}
		if(str[i] === ")"){
			bracketLevel--;
		}
		if(str[i] === char && bracketLevel === 0){
			indices.push(i);
		}
	}
	return indices;
}

var interpretPolynomial = function(str) {
	if(str[0] === "("){
		var entireBrackets = true; 
		var bracketLevel = 1;
		for(var i = 1; i < str.length; i++){
			if(str[i] === "("){
				bracketLevel++;
			}
			if(str[i] === ")"){
				bracketLevel--;
			}
			if(bracketLevel === 0 && i !== str.length-1){
				entireBrackets = false;
			}
		}
		str = entireBrackets ? str.substring(1, str.length - 1) : str;
	}

	if(isSumOfProducts(str)){
		return interpretSumOfProducts(str);
	}

	var plusIndices = getCharIndicesBrackets(str, "+");

	var adds = []
	for (var i = 0; i < plusIndices.length; i++){
		if(i === 0){
			adds.push(str.substring(0, plusIndices[0]));
		} else {
			adds.push(str.substring(plusIndices[i-1]+1, plusIndices[i]))
		}
	}
	adds.push(str.substring(plusIndices[plusIndices.length-1]+1))



	for(var j = 0; j < adds.length; j++){
		var mults = [];
		var mult = adds[j];
		
		var multIndices = getCharIndicesBrackets(mult, "*");

		for (var i = 0; i < multIndices.length; i++){
			if(i === 0){
				var temp = mult.substring(0, multIndices[0]);
				//mults.push(interpretPolynomial(temp));
				mults.push(temp);
			} else {
				var temp = mult.substring(multIndices[i-1]+1, multIndices[i]);
				//mults.push(interpretPolynomial(temp));
				mults.push(temp);
			}
		}

		if(multIndices === []){
			multIndices = [0];
		}

		//mults.push(interpretPolynomial(mult.substring(multIndices[multIndices.length-1]+1)));
		mults.push(mult.substring(multIndices[multIndices.length-1]+1));

		for(var i = 0; i < mults.length; i++){

			var expIndices = getCharIndicesBrackets(mults[i], "$");
			if(expIndices.length === 1){
				var base = mults[i].substring(0, expIndices[0]);
				var exp = mults[i].substring(expIndices[0]+1)
				base = interpretPolynomial(base);
				base.pow(Number(exp));
				mults[i] = base;
			} else if(expIndices.length === 0){
				mults[i] = interpretPolynomial(mults[i]);
			} else throw "Exponent Syntax Error";
		}


		var multPol = new Polynomial([new XTerm(1, 0)]);

		for(var i = 0; i < mults.length; i++){
			multPol.mult(mults[i]);
		}
		adds[j] = multPol;
	}


	var addPol = new Polynomial([new XTerm(0, 0)]);
	for(var i = 0; i < adds.length; i++){
		addPol.add(adds[i]);
	}
	return addPol;
}

Polynomial.prototype.toString = function() {
	var out = "";
	if(this.XTerms.length !== 0){
		var xt = this.XTerms[this.XTerms.length - 1];
		out += xt.factor + "x^" + xt.exponent;
	}
	for(var i = this.XTerms.length-2; i >= 0; i--){
		var xt = this.XTerms[i];
		var xtstr;
		if(xt.exponent === 0){
			xtstr = Math.abs(xt.factor);
		} else if (xt.exponent === 1) {
			xtstr = Math.abs(xt.factor) + "x";
		} else {
			xtstr = Math.abs(xt.factor) + "x^" + xt.exponent;
		}


		if(xt.factor < 0){

			out += " - " + xtstr;
		} else {

			out += " + " + xtstr;
		}
	}
	return out;
}

var replaceAll = function(str, a, b) {
	var prevStr;
	do {
		prevStr = str;
		str = str.replace(a, b);
	} while(prevStr !== str);

	return str;
}

var stringToPolynomial = function(str) {
	str = replaceAll(str, " ", "");
	for(var i = 1; i < str.length-1; i++){
		if(str[i] === "("){
			if(/\d/.test(str[i-1])){
				str = str.substring(0, i) + "*" + str.substring(i);
			}
		} else if(str[i] === ")"){
			if(/\d/.test(str[i+1])){
				str = str.substring(0, i+1) + "*" + str.substring(i+1);
			}
		}
	}
	str = replaceAll(str, ")(", ")*(");
	str = replaceAll(str, "x(", "x*(");
	str = replaceAll(str, ")x", ")*x");
	str = replaceAll(str, ")^", ")$");
	for(var i = 0; i < str.length; i++){
		if(str[i] === "-"){
			if(str[i-1] === "*"){
				str = str.substring(0, i-1) + "*-1*" + str.substring(i+1);	
			} else {
				str = str.substring(0, i) + "+-1*" + str.substring(i+1);	
			}
			i += 4;
		}
	}
	console.log(str);
	return interpretPolynomial(str);
}

var pol1 = new Polynomial([new XTerm(1, 0), new XTerm(1, 1)]);