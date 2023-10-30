#include <bits/stdc++.h>
using namespace std;

int main() {
    int arr[] = {1,2,1,4,3,1};
    int n = 6;
    
    int maxfreqsofar = 0; //maxfreqsofar is the highest frequency found so far
    int currfreq; //currfreq is the frequency of the current element
    
    for(int i = 0; i < n; ++i){
        currfreq = 1; //currfreq is set to one after every iteration
        
        for(int j = 0; j < n; ++j){
            if(i == j)continue; //skip the current iteration as we don't want to compare the same indexes
            
            if(arr[j] == arr[i]){
                currfreq++;
            }
        }
        if(currfreq > maxfreqsofar){ //if the frequency of the current element is greater than the maxfreqsofar, then replace it
            maxfreqsofar = currfreq;
        }
    }
    cout << "The minimum number of operations required to make all elements equal is: " << (n - maxfreqsofar) << endl;
}