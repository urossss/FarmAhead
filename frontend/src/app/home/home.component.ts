import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  quotes = [
    {
      quote: 'FarmAhead je najbolji sajt na svetu, imam sve što mi je potrebno na jednom mestu!',
      author: 'Mico Micovic, poljoprivrednik'
    },
    {
      quote: 'FarmAhead je u potpunosti promenio naš način poslovanja, napredovali smo u svakom smislu!',
      author: 'Pera Peric, preduzetnik'
    },
    {
      quote: 'Uz FarmAhead, bavljenje poljoprivredom je lakše nego ikad!',
      author: 'Milena Milenic, poljoprivrednica'
    }
  ];

  curQuoteInd = 0;
  curQuote: {
    quote: string,
    author: string
  }

  constructor() { }

  ngOnInit(): void {
    this.curQuote = this.quotes[this.curQuoteInd];
  }

  previousQuote() {
    this.curQuoteInd = (this.curQuoteInd + this.quotes.length - 1) % this.quotes.length;
    this.curQuote = this.quotes[this.curQuoteInd];
  }

  nextQuote() {
    this.curQuoteInd = (this.curQuoteInd + 1) % this.quotes.length;
    this.curQuote = this.quotes[this.curQuoteInd];
  }

}
