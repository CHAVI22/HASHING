#include <bits/stdc++.h>
using namespace std; 

int pairSum(int arr[], int x, int size){
    unordered_set<int> pairSet;
    for(int i = 0; i < size; i++){
        // we are using temp to take the difference which will help us in finding the remaining number in the set
        int temp = x - arr[i]; 
        // checking if pairset.find method finds the element temp in the set till end element the end 
        if(pairSet.find(temp) != pairSet.end()){ 
            return 0;
        }
        // Every Element will be inserted in the set if we didn't find the answer using the current element
        pairSet.insert(arr[i]);
    }
    return -1;
}
int main(){
    int arr[] = {0,-1,2,-3, 1};
    int x = -2;
    int size = sizeof(arr) / sizeof(arr[0]);
    if(pairSum(arr, x, size) == -1){
        cout << "false" << endl;
    }else{
        cout << "true" << endl;
    } 
    return 0;
}