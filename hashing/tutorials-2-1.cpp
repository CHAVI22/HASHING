#include<bits/stdc++.h>
using namespace std;

int main(){
    unordered_set<int> s;
    unordered_set<int>::iterator itr;

    s.insert(2);
    s.insert(4);
    s.insert(1);

    /* s = [1]
           [4]
           [2]
    */

    //Displaying element 
    for( itr=s.begin();itr!=s.end();itr++){
           cout<<*itr<<endl;
    }
    
    //display if 2 present or not
    if(s.find(2)!=s.end()){
        cout<<"Found";
    }
    else
    {
        cout<<"Not found";
    }
    cout<<"\n";


    //set where order matters
    set<int> g ; 
    set<int>::iterator it;
    
    //inserting numbers in the set
    g.insert(2);
    g.insert(5);
    g.insert(1);
    g.insert(5);//inserting 5 double time will have no effect
    
    //set looks like this : {1,2,5}
    
     for( it=g.begin();it!=g.end();it++){
           cout<<*it<<endl;
    }
    //checks if "2" exists in the set or not
    if(g.find(2)!=g.end()){
        cout<<"Found";
    }
    else
    {
        cout<<"Not found";
    }
    cout<<"\n";
    return 0;
}