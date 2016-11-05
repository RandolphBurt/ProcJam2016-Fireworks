class NumberProceduralGeneration {
    constructor(private seed:number, private readonly minLength:number, private readonly  maxLength:number) {
    } 

    public generate = (iterations:number) : string[] => {
        let procedurallyGeneratedString = this.procedurallyGenerateNumberString(iterations);

        let numberList:string[] = this.splitNumberString(procedurallyGeneratedString);

        console.log(numberList.length);
        console.log(procedurallyGeneratedString.length);
        
        return numberList;
    };

    private procedurallyGenerateNumberString = (iterations:number) : string => {
        let procedurallyGeneratedString = '';
        for (var i = 0; i < iterations; i++) {
            var word = this.getNextNumberSequence().toString().replace('.', '');
            procedurallyGeneratedString = procedurallyGeneratedString + word;
        }
        return procedurallyGeneratedString;
    }

    private getNextNumberSequence = () : number => {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    private splitNumberString = (input:string) : string[] => {
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