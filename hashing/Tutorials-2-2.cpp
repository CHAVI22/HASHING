#include<bits/stdc++.h>
using namespace std;

int main(){

  
    unordered_map <int,int> d ; 
    //inserting numbers in the map with their frequencies 
    d[2] = 1 ;
    d[5] = 2 ;
    
    //map looks like this : 
  /*  
    Key   Value
    2-->  1
    
    5-->  2
    */
    //checks if "2" as key exists in the map or not
    if(d.find(2)!=d.end()){
        cout<<"Found";
    }
    else
    {
        cout<<"Not found";
    }
    cout<<"\n";
    
    //check the frequency of key "5"
    cout<<d[5];
    cout<<"\n";
    
    
    map <int,int> kk ; 
    //inserting numbers in the map with their frequencies 
    kk[2] = 1 ;
    kk[5] = 2 ;
    
    //map looks like this : 
  /*  
    Key   Value
    2-->  1
    
    5-->  2
    */
    //checks if "2" as key exists in the map or not
    if(kk.find(2)!=kk.end()){
        cout<<"Found";
    }
    else
    {
        cout<<"Not found";
    }
    cout<<"\n";
    
    //check the frequency of key "5"
    cout<<kk[5];
    cout<<"\n";
    
    
    return 0;
}