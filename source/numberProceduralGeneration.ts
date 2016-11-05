class NumberProceduralGeneration {
    private seed:number;
    private minLength:number;
    private maxLength:number;

    constructor(seed:number, minLength:number, maxLength:number) {
        this.seed = seed;
        this.minLength = minLength;
        this.maxLength = maxLength;
    } 

    public Generate = (iterations:number) : string[] => {
        let procedurallyGeneratedString = this.ProcedurallyGenerateNumberString(iterations);

        let numberList:string[] = this.SplitNumberString(procedurallyGeneratedString);

        console.log(numberList.length);
        console.log(procedurallyGeneratedString.length);
        
        return numberList;
    };

    private ProcedurallyGenerateNumberString = (iterations:number) : string => {
        let procedurallyGeneratedString = '';
        for (var i = 0; i < iterations; i++) {
            var word = this.GetNextNumberSequence().toString().replace('.', '');
            procedurallyGeneratedString = procedurallyGeneratedString + word;
        }
        return procedurallyGeneratedString;
    }

    private GetNextNumberSequence = () : number => {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    private SplitNumberString = (input:string) : string[] => {
        let numberList:string[] = [];
        let count = 0;
        var resultLength = input.length;

        while (count < resultLength) {
            var splitLength = (parseInt(input.substr(count, 2)) % (this.maxLength - this.minLength)) + this.minLength;
            if (splitLength == 0) {
                splitLength = 1;
            }
            var word = input.substr(count + 2, splitLength);
            numberList.push(word);
            console.log(word);
            count = count + splitLength + 2;
        }
        return numberList;
    }
}