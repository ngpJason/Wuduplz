import { observable, action } from "mobx";

class RootStore {
    // observable means global varaible
    @observable UserName = "";

    @observable PassWord = "";

    @observable Email = "";

    @observable UserId = "";

    @observable Country = "";

    @observable City = "";

    @observable Province = "";

    @observable Age = "";

    @observable keywords = [];

    @observable Image = "";


    @observable status = false;

    @observable membership =0;

    @observable route = 'Login';
    @observable server='';

    @observable sendIndicator = false;

    @action setSendIndicator(param){
      this.sendIndicator=param;
    }

    @action setMembership(membership){
      this.membership=membership;
    }

    @action setProvince(province){
      this.Province=province;
    }

    @action setImage(Image){
      this.Image=Image;
    }

    @action setServer(address){
      this.server=address;
    }

    @action setUserId(userid){
        this.UserId = userid;
    }

    @action setRoute(route){
      this.route = route;
  }

    @action setPassWord(password){
      this.PassWord = password;
    }

    @action setEmail(email){
      this.Email = email;
    }

    @action setUserName(username){
      this.UserName = username;
    }
    // action changename is a function can change global variable
    @action changeName(name) {
      this.name = name;
    }
    @action setStatus(status){
      this.status=status;
    }

    @action setCity(param){
      this.City=param;
    }

    @action setCountry(param){
      this.Country=param;
    }

    @action setAge(param){
      this.Age=param;
    }

    @action pushKeyword(param){
      this.keywords.push(param)
    }

    @action clearKeywords(){
      this.keywords=[]
    }

    @action updateOneKeyword(index,content){
      this.keywords[index].KeywordContent=content
    }

    @action clearAll(){
      this.UserName = "";

      this.PassWord = "";
  
      this.Email = "";
  
      this.UserId = "";
  
      this.Country = "";
  
      this.City = "";
  
      this.Province = "";
  
      this.Age = "";
  
      this.keywords = [];
  
      this.Image = "";
  
  
      this.status = false;
  
      this.membership =0;
  
      this.route = 'Login';
      this.server='';
      this.sendIndicator=false;
    }

    @action updateRoot(data){
      if(data.UserId)
        this.UserId = data.UserId
      if(data.UserName)
        this.UserName = data.UserName
      if(data.Password)
        this.PassWord = data.Password
      if(data.Email)
        this.Email = data.Email
      if(data.Country)
        this.Country = data.Country
      if(data.City)
        this.City = data.City
      if(data.Age)
        this.Age = data.Age
      if(data.PhotoPath)
        this.Image=data.PhotoPath
      
      if(data.Membership)
        this.membership=data.Membership


      if(data.Province)
        this.Province=data.Province

      if(data.keywords){
        this.keywords=[];
        for(var i=0;i<data.keywords.length;i++)
          this.keywords.push(data.keywords[i])
      }
        
      

    }

  }
  
export default new RootStore();