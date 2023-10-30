#include <iostream>

using namespace std;

bool checkDuplicatesWithinK(int arr[], int n, int k)
{
    
 for(int i=0; i<n ;i++)//outer loop
	  {
	      for(int j=1; j<=i+k&&j<n; j++)//inner loop
	      {
	          if(arr[i]==arr[j]){   
	              if((j-i)<=k) return true;
	          }
	      }
	  }
	  return false;
 
 
}

int main() {
    int arr[] = {1,2,3,1,4,5};
    int n = sizeof(arr) / sizeof(arr[0]);
    if (checkDuplicatesWithinK(arr, n, 3))
        cout << "Yes";
    else
        cout << "No";
    // cout<<checkDuplicatesWithinK(arr,n,3);
}