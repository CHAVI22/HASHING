#include <bits/stdc++.h>

using namespace std;

int main() {
    int arr1[] = {6,7,3,2};
    int arr2[] = {2,3};
    int n1 = sizeof(arr1)/sizeof(*arr1), n2 = sizeof(arr2)/sizeof(*arr2);

    unordered_set<int> st;
    for(int i=0;i<n1;++i){
        st.insert(arr1[i]);
    }
    
    for(int i=0;i<n2;++i){
        if(st.count(arr2[i]) == 0){
            cout << "Arr2 is not a subset of Arr1" << endl;
            return 0;
        }
    }
    cout << "Arr2 is a subset of Arr1" << endl;
    return 0;
}