#include <bits/stdc++.h>
using namespace std;
void checkSubset(int Arr1[], int Arr2[], int size1, int size2)
{
    /* Initializing Resultant Variable */
    bool subset = true;
    
    /* For Every Element of Arr2, linearly search in Arr1 */
    for(int i = 0; i < size2; i++)
    {
        int temp = 0;
        for(int j = 0; j < size1; j++)
        {
            if(Arr2[i] == Arr1[j])
            {
                temp = 1;
                break;
            }
        }
        if(temp == 0)
        {
            subset = false;
            break;
        }
    }
    
    /* Printing the Result */
    if(subset)
    {
        cout<<"Arr2 is subset of Arr1";
    }
    else
    {
        cout<<"Arr2 is not a subset of Arr1";
    }
}
 
int main()
{
    int Arr1[] = {1, 2, 3, 4, 5};
    int Arr2[] = {3, 1,9};
    
    int size1 = sizeof(Arr1)/sizeof(Arr1[0]);
    int size2 = sizeof(Arr2)/sizeof(Arr2[0]);
    
    checkSubset(Arr1,Arr2,size1,size2);
}