import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chart-two',
  templateUrl: './awesomplete.component.html',
  styleUrls: ['./awesomplete.component.css']
})
export class AwesompleteComponent implements OnInit {
  public continents = [{
    id: 1,
    name: 'Asia',
    population: '4,157,300,000'
  }, {
    id: 2,
    name: 'Africa',
    population: '1,030,400,000'
  }, {
    id: 3,
    name: 'Europe',
    population: '738,600, 000'
  }, {
    id: 4,
    name: 'North America',
    population: '461,114,000'
  }, {
    id: 5,
    name: 'South America',
    population: '390,700,000'
  }, {
    id: 6,
    name: 'Australia',
    population: '36,700,000'
  }, {
    id: 7,
    name: 'Antartica',
    population: 0
  }
  ];

  public myForm: FormGroup;

  constructor(private builder: FormBuilder, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.myForm = this.builder.group({
      continent: '',
    });
  }


  autocompleListFormatter = (data: any): SafeHtml => {
    const html = `<span>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  onSubmit(value: any) {
    console.log(value);
  }

  myValueFormatter(data: any): string {
    return data['id'];
  }


}
