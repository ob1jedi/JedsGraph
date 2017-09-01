
//================= DATA STRING HELPER =====================================================================================================================
var DataStringHelper = function () {

	this.getNewDataString = function () {
		return '|';
	}


	// ===== PUBLIC ===== //
	this.indexOfElementInDataString = function (string, targetWord) {
		validateInputString(string);
		if (string == "|") {
			// ...There are no more words to the left.
			// Return 1 to say that the insertion index is the current separator + 1, and 0.1 is a flag to say the the item was not found.
			return 1.1;
		}
		// Get the mid-index of the data string
		var stringCenterIndex = getCenterIndex(string);
		// Get elements pre-separator-index...
		var centerWordStartSeparatorIndex = getFirstLeftSeparatorIndexFromIndex(string, stringCenterIndex, ['|'])
		// Get elements data-separator-index... (eg the colon that separates the label from the data)
		var centerWordEndSeparatorIndex = getNextSeparatorIndex(string, centerWordStartSeparatorIndex + 1, [':', '|'])
		// Get elements post-separator-index...
		var centerElementEndSeparatorIndex = getNextSeparatorIndex(string, centerWordStartSeparatorIndex + 1, ['|'])
		// Get the word from the data string...
		var wordFromArray = string.slice(centerWordStartSeparatorIndex + 1, centerWordEndSeparatorIndex);
		
		// Get the elements word-index...
		var leftWordIndex = centerWordStartSeparatorIndex + 1;

		for (var charIndex = 0; charIndex < Math.min(targetWord.length, wordFromArray.length) ; charIndex++) {

			if (character1IsBeforeCharacter2(targetWord[charIndex], wordFromArray[charIndex]))
				return searchLeftHalfOfDataBlockReturnIndex(string, centerWordStartSeparatorIndex, targetWord, this);

			if (character1IsAfterCharacter2(targetWord[charIndex], wordFromArray[charIndex]))
				return searchRightHalfOfDataBlockReturnIndex(string, centerElementEndSeparatorIndex, targetWord, this);
		}
		// ...All characters match.

		if (wordsAreIdentical(targetWord, wordFromArray))
			// ...Found word, return success...
			return centerWordStartSeparatorIndex + 1;

		if (wordIsLonger(targetWord, wordFromArray))
			// ...Word is longer, go right...
			return searchRightHalfOfDataBlockReturnIndex(string, centerElementEndSeparatorIndex, targetWord, this);
		//return centerElementEndSeparatorIndex + indexInRightHalf;

		if (wordIsShorter(targetWord, wordFromArray))
			// ...Word is shorter, go left...
			return searchLeftHalfOfDataBlockReturnIndex(string, centerWordStartSeparatorIndex, targetWord, this);

	}

	this.getWordAtIndex = function (inputString, index) {
		return inputString.slice(index, getNextSeparatorIndex(inputString, index, ['|']));
	}

	this.insertElementIntoDataString = function (dataString, newElement) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, newElement);
		
		if (!elementExists(dataElementIndex)) {
			// Element doesnt exist yet.
			// Get Data String
			var insertionIndex = Math.trunc(dataElementIndex);
			var newDataString = dataString.slice(0, insertionIndex) + newElement + '|' + dataString.slice(insertionIndex);
			
			return newDataString;
		}

	}

	this.numberBinarySearch = function (set, criteria) {
		if (set.length === 0) {
			return 0;
		}
		var checkAtIndex = Math.floor(set.length / 2);
		if (set[checkAtIndex] === criteria)
			return checkAtIndex;
		else if (criteria > set[checkAtIndex]) {
			return checkAtIndex + 1 + this.numberBinarySearch(set.slice(checkAtIndex + 1), criteria); // back half of the array
		} else {
			return this.numberBinarySearch(set.slice(0, checkAtIndex - 1), criteria); // front half of the array
		}
	}

	this.deleteElementFromDataString = function (dataString, element) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, element);
		
		if (elementExists(dataElementIndex)) {
			// Element exists.
			var startIndex = Math.trunc(dataElementIndex);
			var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
			var dataString = dataString.slice(0, startIndex - 1) + dataString.slice(endIndex);
		}
		return dataString;
	}

	this.getDataFromDataString = function (dataString, elementName) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, elementName);
		if (elementExists(dataElementIndex)) {
			var element = getElementFromDataString(dataString, dataElementIndex);
			var partitions = element.split(':');
			return (partitions.length > 1) ? partitions[1] : undefined;
		}
		return null;
	}

	this.replaceDataInElement = function (dataString, elementName, newData) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, elementName);
		if (elementExists(dataElementIndex)) {
			var startIndex = getNextSeparatorIndex(dataString, dataElementIndex, [':', '|']);
			var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
			var dataString = dataString.slice(0, startIndex) + ":" + newData + dataString.slice(endIndex);
		}
		else {
			dataString = this.insertElementIntoDataString(dataString, elementName + ":" + newData);
		}
		return dataString;
	}

	this.ensureDataIntoElement = function (dataString, elementName, newData) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, elementName);
		if (elementExists(dataElementIndex)) {
			var startIndex = getNextSeparatorIndex(dataString, dataElementIndex, [':', '|']);
			var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
			var elementData = dataString.slice(startIndex + 1, endIndex);
			var newDataString = ensureDataIntoString(elementData, newData);
			var dataString = dataString.slice(0, startIndex) + ":" + newDataString + dataString.slice(endIndex);
		}
		else {
			var fullElement = elementName;
			if (newData != undefined)
				fullElement = fullElement + ":" + newData;
			dataString = this.insertElementIntoDataString(dataString, fullElement);
		}
		return dataString;
	}

	this.ensureDataNotInElement = function (dataString, elementName, excludeData) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, elementName);
		if (elementExists(dataElementIndex)) {
			var startIndex = getNextSeparatorIndex(dataString, dataElementIndex, [':', '|']);
			var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
			var elementData = dataString.slice(startIndex + 1, endIndex);
			var newDataString = removeDataFromString(elementData, excludeData);
			var dataString = dataString.slice(0, startIndex) + ":" + newDataString + dataString.slice(endIndex);
		}
		return dataString;
	}

	this.clearElementData = function (dataString, elementName, newData) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, elementName);
		if (elementExists(dataElementIndex)) {
			var startIndex = getNextSeparatorIndex(dataString, dataElementIndex, [':', '|']);
			var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
			var dataString = dataString.slice(0, startIndex) + dataString.slice(endIndex);
		}
		return dataString;
	}

	this.getAllElements = function (dataString) {
		var elementArray = dataString.split('|');
		return elementArray.splice(1, elementArray.length - 2);
	}

	// ===== PRIVATE ===== //
	function removeDataFromString(dataString, excludeData) {
		var dataArray = dataString.split(',');
		var index = dataArray.indexOf(excludeData);
		if (index == -1)
			return dataString;
		dataArray = dataArray.splice(index - 1, 1);
		return dataArray.join();
	}

	function ensureDataIntoString(dataString, newData) {
		var dataArray = dataString.split(',');
		if (dataExistsInArray(dataArray, newData))
			return dataString;
		// TODO: add sorting to this.
		dataArray.push(newData);
		return dataArray.join();
	}
	function dataExistsInArray(someArray, someElement) {
		return someArray.indexOf(someElement) > -1;
	}
	function elementExists(flaggedDataElementIndex) {
		return !hasNewFlag(flaggedDataElementIndex);
	}

	function getElementFromDataString(dataString, startIndex) {
		var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
		return dataString.slice(startIndex, endIndex);
	}
	function hasNewFlag(dataElementIndex) {
		return (dataElementIndex % 1) > 0;
	}
	function validateInputString(string) {
		// Validate input data string...
		if (string[0] !== '|'
			|| string[string.length - 1] !== '|'
			|| string.length === 0
			|| string == '||')
			throw "Invalid data-string";
	}
	function character1IsBeforeCharacter2(character1, character2) {
		return character1.charCodeAt(0) < character2.charCodeAt(0);
	}
	function character1IsAfterCharacter2(character1, character2) {
		return character1.charCodeAt(0) > character2.charCodeAt(0);
	}
	function wordIsShorter(targetWord, wordFromArray) {
		return targetWord.length < wordFromArray.length;
	}
	function wordIsLonger(targetWord, wordFromArray) {
		return targetWord.length > wordFromArray.length;
	}
	function wordsAreIdentical(word1, word2) {
		return word1 === word2;
	}
	function searchRightHalfOfDataBlockReturnIndex(string, fromIndex, targetWord, dataDriver) {
		return fromIndex + dataDriver.indexOfElementInDataString(getRightHalfOfString(string, fromIndex), targetWord);
	}
	function searchLeftHalfOfDataBlockReturnIndex(string, fromIndex, targetWord, dataDriver) {
		return dataDriver.indexOfElementInDataString(getLeftHalfOfString(string, fromIndex), targetWord);
	}
	function getRightHalfOfString(string, fromIndex) {
		return string.slice(fromIndex);
	}
	function getLeftHalfOfString(string, fromIndex) {
		return string.slice(0, fromIndex + 1);
	}
	function charactersMatch(char1, char2) {
		return char1 === char2;
	}
	function getFirstLeftSeparatorIndexFromIndex(string, startFromIndex, separatorArray) {
		var checkAtIndex = startFromIndex;
		var overflow = 0;
		while (!arrayContains(separatorArray, string[checkAtIndex]) && checkAtIndex >= -1) {
			if (++overflow > 100)
				throw "Overflow";
			checkAtIndex--;
		}
		if (checkAtIndex === -1)
			throw "Missing separator in index";
		return checkAtIndex;
	}
	function getNextSeparatorIndex(string, startFromIndex, separatorArray) {
		var checkAtIndex = startFromIndex;
		var overflow = 0;
		while (!arrayContains(separatorArray, string[checkAtIndex]) && checkAtIndex < string.length) {
			if (++overflow > 100)
				throw "Overflow";
			checkAtIndex++;
		}
		if (checkAtIndex >= string.length)
			throw 'Missing separator in index in string: "' + string + '", starting from index: ' + startFromIndex;
		return checkAtIndex;
	}
	function getCenterIndex(string) {
		return Math.floor(string.length / 2);
	}
	function arrayContains(array, element) {
		for (var i = 0; i < array.length; i++)
			if (array[i] === element)
				return true;
		return false
	}

	
}
//======================================================================================================================================
