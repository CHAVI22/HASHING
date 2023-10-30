#include<bits/stdc++.h>
using namespace std;

int main(){
    int a[9]={1,3,3,4,1,4,4,4,4};
    int b[9]={0};
    int x;
    for(int i=0;i<9;i++){
        x=a[i];
        b[x]=b[x]+1;
    }

    // for(int i=0;i<9;i++){
    //     cout<<b[i]<<" ";
    // }
    int q=3;
    int queries[3]={1,3,4};
    int j=0;
    while(j<q){
       int x=queries[j];
       cout<<b[x]<<" ";
       j++;
    }
    return 0;
}