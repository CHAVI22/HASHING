#include <unordered_map> 
#include<bits/stdc++.h>
using namespace std;

int main()
{
    int A[5] = {4, 2, 2, 6, 4};
    int B = 6;
    int n1=5;
 
    unordered_map<int, int> mp;
    int count=0,sum=0;
    for(int i=0;i<n1;i++)
    {
        sum=A[i]^B;
        if(sum==B) count++;
        count+=mp[sum-B];
        mp[sum]++;
    }
    cout<<count;
}