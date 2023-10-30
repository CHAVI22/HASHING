#include <bits/stdc++.h>

using namespace std;

bool isSubset(int arr1[], int n1, int arr2[], int n2){
    map<int, int> mp;
    for(int i=0;i<n1;++i){
        mp[arr1[i]]++; //count frequencies of all elements
    }
    for(int i=0;i<n2;++i){
        if(mp[arr2[i]] == 0) return false; //if we run out of element or it was not present in arr1, then return false
        mp[arr2[i]]--; //decrease count by 1 as we have matched it with current arr2[i]
    }
    return true;
}

int main() {
    int arr1 [] = {6,7,3,2};
    int arr2 [] = {6,7,2,2};
    int n1 = sizeof(arr1)/sizeof(arr1[0]), n2 = sizeof(arr2)/sizeof(arr2[0]);
    cout << (isSubset(arr1, n1, arr2, n2) ? "arr2 is a subset of arr1" : "arr2 is not a subset of arr1") << endl;
    
}