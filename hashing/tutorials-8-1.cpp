#include <bits/stdc++.h>
using namespace std;

bool pairSum(int arr[], int x, int size){
    int count=0;
    //traversing i till size-1 because at the last index we don't have any element further to make pair
    for(int i = 0; i < size-1; i++){ 
        for(int j = i+1; j < size; j++){ //we are starting from i+1 because no repetition of same number is used
            if(arr[i] + arr[j] == x){ //checking the condition if both sum value is equal to x
                return 1; // if above condition gets true we arer returning 1 and stopping the execution
            }
        }
    }
    return 0;
}

int main(){
    int arr[] = {1, -2, 1, 0, 5}; //custom
    int x = 0;
    int size = sizeof(arr) / sizeof(arr[0]);
    
    if(pairSum(arr, x, size) == 1){
        cout << "true" << endl;
    }else{
        cout << "false" << endl;
    }
    return 0;
}