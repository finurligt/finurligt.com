declare module 'js-polynomial-regression' {
    namespace PolynomialRegression {
      function read(data: DataPoint[], degree: number): PolynomialRegression;
      function getTerms(): number[];
      function predictY(terms: number[], x: number): number;
    }
  
    // Export the DataPoint interface
    export interface DataPoint {
      x: number;
      y: number;
    }
  
    // Export the PolynomialRegression namespace
    export = PolynomialRegression;
  }