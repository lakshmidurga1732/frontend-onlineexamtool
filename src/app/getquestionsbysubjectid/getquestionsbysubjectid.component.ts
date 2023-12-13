import { Component,OnInit } from '@angular/core';
import { HttpClient,HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router,ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Userresponse } from '../Models/userresponse';
import { Questionbank } from '../Models/questionbank';
@Component({
  selector: 'app-getquestionsbysubjectid',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule],
  templateUrl: './getquestionsbysubjectid.component.html',
  styleUrl: './getquestionsbysubjectid.component.css'
})
export class GetquestionsbysubjectidComponent {
  questionbank: Questionbank[] = [];
  userresponse: Userresponse[] = [];
  subjectId?: number = 0;
  testid?:any;
  userid?:any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }),
  };
  constructor(private http: HttpClient, private router: Router, private activatedroute: ActivatedRoute) {
    this.testid=localStorage.getItem("testID")
    this.userid=localStorage.getItem("userId")
    console.log(this.userid)
   }
  ngOnInit(): void {
    this.activatedroute.params.subscribe(p => {
      this.subjectId = p['subjectID'];
      this.starttest();
      this.userresponse = this.questionbank.map(() => ({ userAnswer: '',testID:this.testid,questionID:0 ,userId:this.userid}));
    });
  }

  starttest() {
    this.http
      .get<Questionbank[]>(
        'http://localhost:5010/api/QuestionBank/GetBySubjectID/' + this.subjectId,this.httpOptions)
      .subscribe(
        (data: Questionbank[]) => {
          this.questionbank = data;
          //this.userresponse = this.questionbank.map(() => ({ userAnswer: '' }));
          this.userresponse = this.questionbank.map(() => ({ userAnswer: '',testID:this.testid,userId:this.userid}));
        },
        (error) => console.error('Error fetching questionbank', error)
      );
  }
  submittest(){
    console.log("User Reponses", this.userresponse);
    for(let i=0;i<this.questionbank.length;i++)
    {
      this.userresponse[i].questionID=this.questionbank[i].questionID
    }
    for(let item of this.userresponse)
    {
      console.log(item)
      this.http
    .post('http://localhost:5010/api/UserResponse/Add',item, this.httpOptions)
    .subscribe((response) => {
        console.log('User responses saved successfully:', response);
        this.router.navigate(['feedback']);
       // this.userresponse = this.questionbank.map(() => ({ userAnswer: '' }));
      },
      (error) => {
        console.error('Error saving user responses:', error);
      }
    );
    }  
  }
}