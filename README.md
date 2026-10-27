

**LLM : Large Language Model**

**LMM : Large Multimodal Model**


## To make function and call them

As we have seen in before case making MCP for weather API led to LLM sending random output as the output was not purely in JSON format and we were using text based input in system instructions to tell the LLM to send structured JSON output when user was asking weather so that we can just call weather API and then give the context to the LLM 

So for this we can now send function information to the LLM **url : https://aistudio.google.com/docs/function-calling?codelanguage=javascript**

So we do not send the whole function code to LLM as LLM do not execute our code so we will just send in the function information along with the user's prompt so that this function will be called if question is asked from that topic and this function will provide LLM with the necessary context and using this context LLM will then reply. (**Image link for better understanding {also in the docs} : https://www.gstatic.com/cloud-cms/6fae8435a773b720d5db0c8746efb318.png**)


**Function calling** lets you connect models to external tools and APIs. Instead of generating text responses, the model determines when to call specific functions and provides the necessary parameters to execute real-world actions. This allows the model to act as a bridge between natural language and real-world actions and data. 

Function calling has 3 primary use cases:

* **Take Actions:** Interact with external systems using APIs, such as scheduling appointments, creating invoices, sending emails, or controlling smart home devices.

* **Augment Knowledge:** Access information from external sources like databases, APIs, and knowledge bases.

* **Extend Capabilities:** Use external tools to perform computations and extend the limitations of the model, such as using a calculator or creating charts.



------------------------------------------------------------------------------------------------------------------------

So for creating cursor like AI agent that automatically creates folder, files, inserts codes, etc so we can manually do it using terminal like command

Creating directory === **mkdir folder_name**

Creating file (html file) === **touch folder_name/file_name.html**


We will install Node.js **child processor** and **util** which will be used to execute terminal commands.


**util.promisify** is a built-in Node.js utility function (from the native util module) that takes a standard callback-based function and converts it into a function that returns a Promise.


This allows you to use async/await or .then()/.catch() syntax with older, callback-style Node.js APIs instead of writing nested callbacks ("callback hell").


So we are using **util** as without it the **exec** inside **child_process** is used using callback hell so instead of that we wanted to use it using async await so hence we used util to promisify it.



------------------------------------------------------------------------------------------------------------------------



In creating code reviewer we have done it all manually from the scratch to list files. We can also do it using **glob** in npm

```bash

npm i glob
```



------------------------------------------------------------------------------------------------------------------------


## Vector 


So in recommendations system when we type anything or on platforms like amazon, etc when we put something in cart it shows us other recommended items we can buy.

So by first thought principle we can do it by just making data about items like all the sets and all and the one that occurs the most is used like if after buying bread, most people were buying butter so it will suggest that. (in the start when we have no data so we will make it like this)

Problems with the current system : 

1. Scalability is a issue as we will need a team of engineers to make the sets manually 

2. When a new product is added making sets will be difficult then 

3. If a user buys orange and we show them other colour pencils and all while the user brought fruits so it can be bad UX as we misunderstood orange as colour instead of fruit



**Graph Based Solution**


So if a person buys somethings like bread, butter, milk, etc together so we will draw an edge between each of these items

Now if another user buys bread and butter only so we will think there is a stronger relation between bread and butter so we will increase the weight of the edge between bread and butter in the graph.

So by doing this we can create a graph which will represent relationships between items and using this we can recommend user the items

Now problem with this is the storage as there will be many rows and columns so it will consume a lot of space

So if a new product is added to the platform so we will be needed to create a row and a column also for this product so that it's relation with all the products can be shown


In this time complexity will also be the problem as if we need to recommend top 5 choices then we will be needed to sort the array

So in short limitations are for graph based solution :

* Size of matrix will be N * N

* Selecting the array and then sort it will be time consuming

* The **Cold Start** problem (Cold start is when initially we have no data then we cannot recommend anything)

* It only captures co-occurrence, not content (like if we buy a specific protein brand regularly and then one day the protein was sold out of this brand and then other brand protein is there so user bought it and that protein was just newly added so we will have no relations of that new protein with the other items so we won't be able to recommend anything there)


So now we can kinda like reduce space by grouping products like different protein brands into a single protein category and we can just give them numbers so we can place all the items bought together close to each other

So now instead of a 2D matrix now we have a 1D array


**Limitations :**

* Now this table will be needed to be created manually by someone as all the related items need to be numbered such that all the items bought together are close to each other so this is hardcoded

* Another problem in this will be the boundaries as after the fruits sections end and gym sections begin so let's assume if someone buys protein or something then we will recommend one or two above and below it's number so if protein is at boundary then one or two above if there is a fruit so it will just recommend fruits so this is also wrong 

* If a new product is added then we will have to manually insert it along with items that are bought together with it and shift the items after it one place

* Some relations cannot be shown like if someone buys protein we recommend them shaker and banana but if we number it the gap between protein and banana will be much more so we won't be able to recommend banana, similarly for shaker 


So in short there is **boundary** problem, **insertion** problem and **single meaning** problem


So now from here comes our vector solutions 

So in Netflix movie recommendation we put movies in let's say for now 2 dimension so now like if we take X-axis as action so in +ve side we can showcase too much action movies and in -ve we can showcase peaceful movies and in Y-axis similarly we can show for comedy and serious 

So now in this graph we can just plot points according to how much comedy is there in a movie and how much action is there based on this we can locate and when a user watches a movie we can just suggest movie near the movie user just watched but only 2 dimensions won't be enough as if there a movie who's like action and serious and there's another movie action and serious but one is like based on real life and other is not then we might need to recommend other one that is kind of similar genre 

So we will need many dimensions and with many dimensions we can see similarities between items much better than in lower dimension ones

So accuracy will be increased 

**vector(King) - vector(Man) + vector(Woman) &#8776; vector(Queen)**

So above statemenet can be debugged as the King and Man will have similarities like masculine, strong, etc. So if from King we remove all the qualities of the Man then all that is left is power, wealth, etc and if in this we add the qualities of the Woman then it will be similar to vector of the Queen

So for recommending things we can use these semantic similarities so whenever a new item is searched by user or comes we will make it's whole vector like if we search "web dev full course" in youtube we make it's vector (the whole statement will have a single vector) and then plot it in the graph and in result give the closest points 

So now question is how to automatically create vectors as if we do this manually then it will take time and money so we need to automate it 

So our neural network creates these vectors (vector embedding)

So in search systems also we do not need to like match it exact word to word, we need to search according to the semantic relationship and intention, so this is given by vector 


### Cosine Similarity 

If there are two vectors A = [a1, a2, a3, _ _ _ _ _ , an] and B = [b1, b2, b3, _ _ _ _ _ , bn] then cosine similarity is

**Cosine Similarity = (A · B) / (||A|| X ||B||)**


In this 

A · B = a1 X b1 + a2 X b2 + a3 X b3 + _ _ _ _ _ _ + an X bn

||A|| = √(a1ˆ2 + a2ˆ2 + a3ˆ2 + _ _ _ _ + anˆ2)

||B|| = √(b1ˆ2 + b2ˆ2 + b3ˆ2 + _ _ _ _ + bnˆ2)


Result of this is always in the range **-1 to 1**

**If answer is 1 then it means both the vectors point in the same direction and they are similar**

**If answer is 0 then it means both the vectors are perpendicular and they are unrelated**

**If answer is -1 then it means both the vectors point in the opposite direction and they are different**


In **eucledian distance** we just calculate the distance between 2 vectors 

Formula : √((x2 - x1)ˆ2 + (y2 - y1)ˆ2 + (z2 - z1)ˆ2) 

So if distance between them is small then they are similar, if it's large they are unrelated / different


Cosine similarity only tells the direction whereas eucledian distance tells about both the magnitude and the direction

So our neural network gives the vector embeddings

So if like "cat" has vector like [10, 20, 30, 40] then if "I love cat, cat is cat, cat is good" is another sentence so as both are talking about cat but in the 2nd sentence also they are talking about cat and occurrence of cat is more so it's magnitude in vector will be increased like let's say [100, 200, 300, 400] 

So if we see cosine similarity then we will see that both of them are same in above example but if we calculate eucledian distance then as due to magnitude difference they will be seen as different/unrelated


So we don't use raw embeddings directly instead we **normalize** the embeddings to speed up the cosine similarity process

So **normalizing** means when we square the vector and add squared vector dimensions and take it's under root it should come as 1

```

Ex : 

If we have a vector [3,4]

So,

Step 1 : Calculate magnitude 

magnitude = √(3ˆ2 + 4ˆ2) = √(9 + 16) = √(25) = 5

Step 2 : Divide each component 

Normalized = [3/5, 4/5] = [0.6, 0.8]


If we verify it

√(0.6ˆ2 + 0.8ˆ2) = √(0.36 + 0.64) = √1 = 1

```


So by normalizing we remove the magnitude and only the direction is seen then in cosine similarity as without it, it would seem as both are same but due to huge magnitude gap it wouldn't recommend it

We use **eucledian distance** in those cases where magnitude is also important

So like in case of temperature/sensor data if we take data of temperature for some days and try to find which day is similar to let's say day A then we will use eucledian distance 

Ex : Day A = [25, 26, 24]
     Day B = [50, 52, 48]
     Day C = [24, 26, 23]

So if we use cosine similarity in this case it will find that Day A and Day B are similar as cosine similarity sees if there's a pattern matching whereas in reality Day A and Day C are same as both of the days has almost similar temperature so in this case we can use eucledian distance

Similarly in case of stock price, geographic coordinates (which places are the nearest to each other), etc


So we use **cosine similarity** only when the meaning matters to us like text semantic search, image similarity, RAG, plagiarism detection, resume matching, etc. 



## Vector Database

So why do we need it 

If we use our recommendation system now so to fetch top 10 results to show to the user we will be needed to compare the vector of item with all the items in the DB.

So if there are like 1 million items or something then it will be very time taking and will lead to bad UX as we will be doing these calculations again and again when someone arrives on our platform, so in conclusion this method takes too much time when number of users increases


So we need another way to do this, something efficient and better than current method


So to reduce time complexity we can first think of sorting the items and then can use binary search on it to reduce time complexity but we do not know in which order should we sort it (like sort it according to movie genres or what as all the items are in this)

[**Note :** We cannot sort the vector like if vector is [30, 23, 24, 12] we cannot sort it to [12, 23, 24, 30] as vector contains meaning even if we don't understand it but it is essential information for system]

So we cannot use this method as we don't know in which order to sort and if items increases and all then we manually need to order items


So now we might think to sort it dimension by dimension as for example if we have v1 = [0.1, 0.3, 0.2, 0.4] and v2 = [0.1, 0.4, 0.5, 0.1] so in this if we compare dimension by dimension we can conclude that vector v1 < vector v2 as in 2nd dimension 0.3 < 0.4

So we can sort like this but will binary search give correct answer when we apply it on this sorted data 

Ex : vectors 

        v1 = [1, 4, 10]
        v2 = [2, 5, 12]
        v3 = [3, 6, 18]
        v4 = [4, 200, 300]
        v5 = [6, 12, 18]
        v6 = [15, 18, 19]

    So if we use binary search to find closest to [2, 100, 150] it will gives us v2 as the answer but in reality v2 is not the answer so this is why binary search is not good in this case, even if we normalize the vectors even then also we will face this problem 


**So we will think about hashing approach as it gives value in O(1) but we cannot do hashing here as hashing gives us the exact result whereas in this case we do not want the exact result, we want similar results**



So to get result fast we use **ANN (Approximate Nearest Neighbour)** approach. In this we give up some amount of accuracy to obtain data at faster speed

ANN is an algorithm that finds a data point in a data set that's very close to the given query point but no necessarily the absolute closest one

It sacrifices a tiny amount of accuracy (it might return 9 of the top 10, plus the 11th) for a massive gain in speed (often orders of magnitude faster)


### First Method : Clustering / Inverted File Index (IVF)

So in this method for simplicity and better understanding let's consider a 2-D graph, in this graph all the item's vectors are plotted then we make clusters like if we make clusters of 10000 points so 10000 points that are closer to each other belong to a cluster

So whenever a new search query is given it will be needed to calculate which all data points are closer to this vector's point so in this it will be time taking as we will be calculating distance from each point and with millions of data it's not possible 

So instead of this we just make a centroid in a cluster and distance from these centroids is calculated and the closest centroid to the new vector is considered and from that cluster 10 or something results is returned (once the cluster is selected then we can just calculate distance between the points in that cluster and new point to find the result so this way instead of calculating distance with millions of data points we just do it with some thousands of data point)

So now in this it will not give top results as there is a possibility that if a vector is located closer to 2 or more cluster points then it will consider only one cluster whose centroid is closest to the point so in this case it might give some top results as the rest top result might be in different clusters 

So what we can do is we can just do a tradeoff to give more accurate results we can just increase time taken in calculation so now instead of one we can just select nearest 2-3 centroids and then will calculate distance of each point to the new point and will then just pick out the top 10 results

So **how are the clusters formed** ?

Using common sense we can first think of a solution like selecting random vector from the millions of vector given in data and select them as the centroid then calculate distance of each point with all these centroids and it belongs to that cluster which has the smallest distance between centroid and this point 

So using this we will find the clusters but in this the distribution of data won't be uniform as if we try to split equal 10000 in each cluster it won't happen as we took the random centroid so to overcome this we take the average of the points in the cluster and the average is the new centroid so by doing this we get new centroids

Then if we keep repeating this same process 100 times or more then after some time it will start giving stable answers of centroid so by 100th iteration we will get the final clusters and the centroids (distribution won't be uniformly distributed still but it would be approximately uniform)


So **why don't we use this approach** ?

We don't use this approach as if we need to add 100 more points then we will be needed to again execute this whole algorithm and make the clusters and centroids again

So this approach can only be best if the data is static

So the first method is the **K-Means Clustering** algorithm only 


### Second Method : Decision Tree Method (Binary Space Partitioning)


In this method it sorts the vector by putting them into a binary search tree so once the vector is sorted they can just use the binary search tree to find the results fast

This method was used by **Spotify**

So we already know that sorting the vectors won't give us correct results as we have already discussed above so we know that this approach won't give us the best results

So in this we will split binary tree like if we only have 2 dimensional vectors so we will alternatively split by finding middle of let's say in root we will find out of all the data the point that can divide all the data in two almost equal halves so based on X-axis dimension we will make this split and then after this we will again find middle point based on Y-axis and split the tree and will keep on doing this until the whole binary tree is made

So while searching it will just calculate distance from each node it encounters and then based on which axis is being compared as in above example it was X-axis and then Y-axis and this was repeated so based on this it moves right or left based on the dimension

So this won't be able to perform good as we know 


### Third Method : HNSW (Hierarchical Navigable Small Worlds) {Mostly Used}

This is mostly used in modern vector DB

In this algorithm it takes **log n** time to search, insert, delete, etc

<img src="https://cdn.sanity.io/images/sy1jschh/production/a52486d62f2e5e8ab649b371b2ac5d5fb5707fcf-1920x1264.png?w=3840&q=80&fit=clip&auto=format">


So in this there are vectors in the bottom layer or layer 0

In this all the vectors are located and they are connected to each of their nearest 3 neighbours (it is configurable you can select any number of nearest neighbours to connect to)


Then from all these vectors randomly 50% vectors are promoted to next layer i.e. layer 1 and then from layer 1 vectors 50% vectors are promoted to layer 2 

And also in each layer they will be connected to their 3 nearest neighbour (this is configurable can use any value)

So like this layers are created 


So if a search query comes to first it will calculate distance with the new point and that of all the points in the topmost layers 

Then it will go down the nearest neighbour it has in top most layer

Then layer below the top most layer it does the same thing calculates the distance and select the closest one to it and does down the layer using that point 

So it will calculate distance with the nearest neighbour to that point only which was nearest to it in layer before and when we reach bottom layer if the result gives us 3 search results but we need to show 5 so we further extend the search in bottom layer by searching neighbours of the neighbours to get 5 search results or the amount we need


Step 1 : In the Top layer

It doesn't scan all points on the top layer. HNSW keeps the top layer extremely sparse so it only starts at a single fixed entry point (or a very small set of entry points). From that entry point, it performs a greedy walk—calculating distance to that point's connected neighbors, moving to the closest neighbor, and repeating until no neighbor gets any closer to your search query.


Step 2 : In the middle layers

The closest node found on Layer $L$ becomes the starting entry point for the search on Layer $L-1$. It uses that point as the anchor to begin its greedy search on the lower, denser layer.

Step 3 : In the bottom layer


When it drops down to a layer, it doesn't just evaluate one point. It explores the local graph neighborhood around that entry point on that layer. It checks all neighbors connected to the entry point, steps to the closest one, checks that new point's neighbors, and keeps hopping along the graph edges on that layer until it hits a local minimum (where all connected neighbors are farther away than the current node).


When HNSW reaches Layer 0 (the bottom layer containing all vectors), it doesn't stop at the single closest point. It expands a candidate queue (controlled by the parameter efSearch). It explores the neighbors of the closest nodes, and then the neighbors of those neighbors, maintaining a dynamic priority queue of the top K closest vectors until it has gathered the requested number of search results (e.g., top 5, top 10, or top 100).



Now the question is **how much time it will take to insert new vectors and also the time to create this hierarchy**


So as to why layers was made in HNSW so if we don't make any layers then only layer 0 will be there where all the vectors are present so there will be an entry point in the graph so it will start searching from that point so in this our question will be when will we stop as if we just calculate distance with all the vectors then it will increase the time complexity 

So now we can make 2 arrays then inside one array insert the nodes to be traversed and in the other array to get the top K results according to the query so in this should we stop when we get the first K results so we cannot stop as in this any top 10 that comes first will be given as result not the top 10 nearest 


So now instead of using 2 arrays we can just use min heap and max heap, in min heap all the newly explored neighbours will be kept sorted according to the min distance to the search vector and from this min heap the most minimum vector distance is selected to go into max heap in which all the vectors which are nearest to current search vector is there and ordered according to the max distance from the search vector so that if we find a minimum point in a min heap which is smaller than the point in max heap so we can delete the top element (max distance {out of all the vector it will has the max distance as max heap}) and insert that element and we can do this until our this max heap which consist of top K results is filled and stable

So in this our stop condition will be when the max heap is full and the min vector distance in min heap is larger than the max heap distance so there will be no change in the max heap so it is stable (as in the min heap the minimum distance from search query will be on the top so if it's larger than the maximum distance found in max heap then all the other vectors will also be greater than the minimum selected from it as it's min heap so we will stop at this point)

But in this method also there is a case that we might not reach the top 10 results as we compared it from entry point and got the top 10 results but the top 10 results were from the other end of the entry point so in this case the result obtained won't be valid

So therefore we do layering 

So in this it compares with neighbours of the selected vector and if it is closer to search query vector then it selects that and check it's neighbours also in the same layer 

So when we like want top 10 results we search for top 50 results and then from these top 50 we give the top 10 results

So this is what **HNSW** does, it search for much more top results than the one requested as if we search for top 10 and it will return a stable array of top 50 results using this we can just give the top 10 closest result as they are arranged in the max heap


So whenever first vector comes we will start our mechanism like till which layer this vector should be there so if it says till layer 1 so in layer1 and layer0 this vector will be present

It will go from top layer to bottom ones and when new one is inserted so let's say it is only till layer 0 so from top k layer to layer 0 it will go and then form connections with closest neighbours (the number of connections is determined by us using the m)

Then if another vector comes then it will let's say till layer 2 so it will go from topmost layer to layer 2 will then stay there and then will go down to layer 1 will be there too and will form connections and then same with layer 0

So now if a new vector is to be inserted it will first go to top layer select the entry point closest to it and through it will go to the next layer and repeatedly will do this to reach the layer like let's say our mechanism said it will go to layer 1 so it will go to layer one and then in that it will find m number of connections using same min heap and max heap and then will go to bottom layer and will do the same

So we started comparision from top so that we won't be able to need to compare with every vector to find the nearest

The single closest neighbor found on this layer then serves as the entry point when dropping down to the layer below it. So after insertion in layer 1 it will using the nearest neighbour drop down to bottom layer and will repeat this process

**Insertion Process Example**

Layer 3 (Above L_new): 
  - Starts at top entry point.
  - Greedy search finds Node A is closest to V.
  - Node A becomes the entry point for Layer 2.

Layer 2 (Above L_new): 
  - Starts search at Node A.
  - Greedy search finds Node B is closest to V.
  - Node B becomes the entry point for Layer 1.

Layer 1 (Target Layer L_new - INSERT HERE):
  - Enters Layer 1 using Node B as the entry point!
  - Finds M nearest neighbors around Node B and connects V to them.
  - Finds Node C is the single closest neighbor on Layer 1.
  - Node C becomes the entry point for Layer 0.

Layer 0 (Bottom Layer - INSERT HERE):
  - Enters Layer 0 using Node C as the entry point!
  - Finds M nearest neighbors around Node C and connects V to them.


So **disavantage** of this is that it will consume **more memory** as same vectors are repeated in different layers 

So we might have seen when we search for any product like bread, etc it will show us all the different types of bread but when we put the bread in cart it will show us all the other products that people buy so how will these we done using HNSW

So for normal search we can just use similarity search as all the milk products of different brands will always be closer to each other than other product and then to give suggestions of other product we can just use HNSW to search top 500 products and them from that we can filter like remove the bread if user bought bread now and show all the unqiue product like after bread people buy butter so instead of showing all different brands of butter we only show one brand of butter and then show some other item like vegetables etc


So we will just train like our neural network on user's behaviour so that our second suggestion of items will work properly


All the search results are already stored in Redis, etc so that it will suggest fast and cron jobs are scheduled to run each day to update this array with items that are currently bought after each item based on user's behaviour using vector databases


### The Compression Method (Product Quantization - PQ)

In real life the vector doesn't only have 2 dimensions, it can have 384 to 3072 dimensions

So since each dimension is floating point integer so therefore each dimension takes 4 bytes of space in memory 

So if let's say a vector has 1536 dimensions then the total amount of space a single vector will take in the memory is 

    1536 * 4 = 6144 bytes 

So if we have billions of vectors then it will take 6.1 Terabytes of RAM and that's very expensive

So these vectors can be easily stored in secondary storage but when we will be needed to process this data then it will take 6.1 Terabytes of RAM to process this whole data 

So we can use virtual memory concept or make a 6TB RAM

So problem is that we are getting too much of the data (dimensions in vector) so if we want to make our process faster we will need 6TB of RAM

So we will be needed to compress our data (and we know due to compression there might be a data loss like in photos when we compress it quality of photo is degraded)


{
    So why there is a quality degradation in photo 

    So in photo there are pixels whose data is stored in the form of RGB (Red Green Blue) so each takes 8 bits (0-255) so photo is stored in the form of pixel which has numbers denoting how much red , blue and green to make up the colour in that pixel of the image so each R G B has 8 bits (256 unique numbers)

    So currently it takes 3 bytes to store each pixel information so in compression there is a booklet which stores all the colours so if a pixel has black colour and booklet has a lighter black colour just a little difference so it will point to that in the booklet and it will store the number it is in booklet in 1 byte (0-255 unqiue colours {256 colours}) so some extra space will be taken by the booklet so that while decompression they can refer to it and get the RGB colours
}


So we also compress the vector so that they can be easily processed in the RAM so for example if we have a 16 dimension vector then we do **chunking** or can say we divide this 16 dimension vector into 4 chunks of 4 dimensions each 


So compression steps is as follows :

**Step 1 :** Divide the vector into chunks 

eg : vector v = [1.1, 2.3, 0.9, 3.4, 8.8, 7.6, 9.1, 6.5, 4.2, 5.5, 3.9, 5.1, 9.9, 8.1, 7.7, 9.3]

So 16 dimension vector into 4 chunks of 4 dimension each

v_chunk1 = [1.1, 2.3, 0.9, 3.4]

v_chunk2 = [8.8, 7.6, 9.1, 6.5]

v_chunk3 = [4.2, 5.5, 3.9, 5.1]

v_chunk4 = [9.9, 8.1, 7.7, 9.3]

**Step 2 :** Create the codebooks (K Cluster / Centroid)

So in this step we first take the chunk 1 of all the vectors present in our memory then to compress this we find 256 centroids of these vectors (by same k-means clustering {randomly assuming 256 centroids and after 100th iteration stable centroids are obtained})

And then according to which centroid they are closed to they are marked with that number 

like centroid 1 is at [0.9, 2.1, 0.8, 3.0] so it will just mark the chunk 1 of vectors as 1 and like this similarly how compression in photo is done it just does this for chunk 1 for all the vectors using these 256 centroids

So now it just takes 1 byte to represent each chunk so in total 4 bytes for 16 dimension vector

So this 256 centroids for chunk 1 of all the vectors is called as **codebook 1**

Similarly for chunk 2, 3 and 4 same process is done and codebook 2, 3, 4 is also created

So now we have successfully compressed the vector 




Product Quantization compresses large floating-point vectors into tiny lossy codebooks using three : 


1. **Splitting the High-Dimensional Vector :** Instead of treating a 1,024-dimensional vector as one huge array, PQ divides it into $m$ smaller sub-vectors (e.g., 8 sub-vectors of 128 dimensions each).

2. **Clustering (K-Means) :** For each sub-vector position across your entire dataset, the database runs K-Means clustering to identify a set of representative points (e.g., 256 cluster centers or "centroids").

3. **Quantization (Compression) :** Instead of storing full 32-bit float numbers for each dimension, the database replaces each sub-vector with the ID index of its nearest cluster center.Since $256 = 2^8$, an index from 0 to 255 takes only 1 byte (8 bits).A 1,024-dimensional vector compressed into 8 sub-vectors drops from 4,096 bytes down to just 8 bytes—a 99% reduction in memory usage!


So now due to compression the quality of result will be degraded as we are using centroids 

So now if query comes it will just divide it into chunks and calculate distance with 256 centroids in each cookbook according to the chunk and returns the top K results based on this



**Step-by-Step Flow When a Query Arrives** 

1. Split the Query & Build the Distance Table

When your raw query vector q enters the system: 

* It is sliced into the same number of chunks (sub-vectors) as your codebook—for example, M = 8 chunks.

* It calculates the distance between chunk 1 and all 256 centroids for chunk 1, chunk 2 against all 256 centroids for chunk 2, and so on.

* This creates a tiny $8 \times 256$ Lookup Table in CPU L1 cache.

2. Scan / Traverse Using Fast Table Lookups

Now, as the search algorithm (like HNSW or IVF) evaluates a candidate vector stored in memory (which is just an 8-byte array like [4, 12, 87, 2, 190, 43, 12, 99]):

* It reads byte 1 (4) $\rightarrow$ Fetches distance from Table[Chunk 1][Centroid 4].

* It reads byte 2 (12) $\rightarrow$ Fetches distance from Table[Chunk 2][Centroid 12].

* It adds those 8 table values together to get the approximate total distance.

3. Rank and Return Top $K$ Candidates

* The search algorithm keeps track of candidate vectors using these approximate distances and collects the top candidates (e.g., top 100 or top 500).

* **Optional Final Re-Ranking:** For the final selection (e.g., top 10), the database reads the full raw uncompressed vectors from disk/RAM to compute exact distances and returns the refined Top $K$ results to the application.



## RAG (Retrieval Augmented Generation)

So in vector DB we store vector and it's metadata also like we will store the original words and all from which the vector is generated and will also keep a unique ID also

We store id for exact search so that we can update, delete, etc the vector stored in vector DB

So if we give a report and ask a query then it is very bad way to give context as it can consume too many tokens as report can be large and all also


So we wanted a way to just fetch that section from the report that the query is talking about so that there will be less token consumption

So this is where our vector DB is used, it is used to give only that section from report to LLM that is similar to the query so that LLM has some context 

So we divide the report in chunks by doing chunking process and then we create the vector of these chunks and then put it in vector DB

So we do divide report into chunks because if we only create vector of report directly then it will always give that vector only so in the end the whole report will be sent as the context (as only one vector will be there as we can make a single vector of the whole report also)



Now there are 2 phases in this (this is how people explain above concept) :

**Indexing Phase**

* In this we take the document and divide it into chunks

* Then for each chunk we find the vector or can say vector embeddings 

* Then we get for each corresponding chunk a vector and we store all this in vector DB

**Query Phase**

* In this phase we take the user's query and find it's embeddings or vector

* Then we will call vector DB and will give the user's query vector and will ask to find the top K results

* Vector DB will return the top K results and then we will call LLM and will give it the top K results (as context) and the user's query

* LLM will analyze it and will return the output and we will show it to the user


So in RAG, the R = Retrieval meaning to retrieve the relevant information from the vector DB

A = Augmented meaning augment this retrieved information and give it to the LLM

G = Generation meaning the LLM generates the output or the result


So why is there a need to build a RAG system so first in companies like amazon, etc they create documentation for everything without actually coding so they will have millions of documents, now what if a problem occurs in amazon site and the solution is in these documents so they cannot search it one by one so they will build a RAG system so that they will just ask LLM and internally all the process happens and returns the result

Similarly in case of court cases there are many documentation and if like our client does a crime so if we need to find how much jail time our client will get so using RAG we can just get all the previous cases where same crime was done and the punishment according to that

We can either also **fine tune** the pre-trained LLM (open source LLM) and further train it on our company's data 

But RAG is better than this as it will consume it's own server to host trained LLM and it will require time to train it with our companies data and we will be needed to do this again and again also if there are any updations so RAG is better

```
Note : Fine-tuning in machine learning is a form of transfer learning where an existing, pre-trained model is further trained on a smaller, task-specific dataset to adapt its capabilities to a new or specialized use case.
```



* First we need to write code to load the PDF file 

* Second we will be needed to write the code for chunking 

* Third we need to run a loop to find the vectors of all the chunks

* Fourth we will be needed to store all these vectors in the vector DB

So **LangChain** has the utility functions for all these things 

So instead of writing everything from scratch we can just use LangChain to complete these steps in 1 line of code or more

Similar to how we know how to do bubble, insertion, etc sorts but instead of writing everything from scratch we just directly use the sort() utility function to make it easier for us


Langchain docs link --> **https://docs.langchain.com/oss/javascript/langchain/overview**


## How to Setup the Project

* Step 1 : Install the required packages

```bash

npm i @langchain/core@latest

npm i @langchain/pinecone @pinecone-database/pinecone @langchain/community @google/genai @langchain/google-genai @langchain/textsplitters

```

We will use **pinecone vector DB** in this project

In pinecone first create an index and then after that create api key and setup environment variables

So in index in pinecone refers to the table only like in normal DBs

In Pinecone, an **Index** is the top-level container that holds your vectors and metadata—functioning conceptually like a table in a traditional relational database (SQL) or a collection in a document database (MongoDB).




When you work with a PDF file on your computer, the file itself is just a binary blob stored on your disk—a complex package of binary code, custom fonts, layout coordinates, embedded image data, and page formatting instructions.

An AI model or text splitter cannot read a raw PDF file as text. If you opened a .pdf file in a plain text editor like Notepad, you would see unreadable characters

When we say we "load" a PDF in LangChain using PDFLoader, "load" means converting that unreadable binary file into plain, usable string variables in your Node.js program's RAM.


* **File I/O (Input/Output):** Node.js opens sample.pdf from your hard drive and reads its raw bytes into memory.

* **Parsing & Decompression:** The loader strips away the PDF layout rendering rules, vector graphics, fonts and page margin coordinates.

* **Text Extraction:** It extracts the underlying human-readable text characters from each page.

* **Data Wrapping:** It wraps that extracted text string into a clean JavaScript object (Document) so your code can work with it


Ex : 

// BEFORE loading: A file on disk you can't feed to an AI model.

// AFTER loading pdf file :

const docs = [
  {
    pageContent: "This is the actual plain text from page 1...",
    metadata: { source: "./sample.pdf", pageNumber: 1 }
  },
  {
    pageContent: "This is the actual plain text from page 2...",
    metadata: { source: "./sample.pdf", pageNumber: 2 }
  }
];


**Every file format stores data differently on disk. An AI model or vector database can only process standard text strings, so a Loader acts as a format-specific translation bridge.**


So now we do chunking of the documents. Chunk overlap is used like in cases if we have fixed chunk size like from 1-1000 then 1001-2000 like this but what if the context of chunk 2 has some part in chunk 1 like 800-1000 so we will need like to take it together with other chunk context so we can overlap like chunk 2 from 800-1800 (chunk size is fixed)

We can see in gemini docs under embeddings section that there are many embedding models (models that return vector in output when we give them string as input)

**Rule of Thumb:** Set overlap to 10% – 20% of your chunk size.


We choose chunk size based on this distinction 

**Smaller:** Fast, precise factual lookup, lower LLM prompt cost.

**Larger:** Richer context, complex multi-paragraph analysis.


We choose dimensions in vector db based on this 

**Lower (384–512):** Fast search, low RAM usage in Pinecone.

**Higher (1,536–3,072):** Fine-grained semantic distinction between subtle concepts.


[ **maxConcurrency : 5** ] this means how many vectors are sent parallelly to vector DB  (in free version of pinecone this much number of connections is allowed but in paid version might allow more connections)

Setting maxConcurrency determines how many of those vector batches are sent to Pinecone at the exact same time (Pinecone enforces a recommended limit of 1,000 vectors per single HTTP upsert request)

maxConcurrency sets an upper bound on how many network requests run in parallel.

If you set maxConcurrency: 5, LangChain limits your application to sending at most 5 HTTP requests simultaneously. Since each Pinecone upload request contains up to 1,000 vectors, setting maxConcurrency: 5 means you will have a maximum of 5 batch requests (5,000 vectors total) in flight at any given moment.

If you have 20,000 document chunks (20 batches of 1,000 vectors):

1. LangChain opens connection slots for Batches 1 through 5.

2. Batches 6 through 20 wait in line in your Node.js memory.

3. As soon as Batch 2 finishes uploading to Pinecone, its slot frees up, and Batch 6 immediately starts uploading.

4. This rolling window ensures you never flood your network sockets or trigger Pinecone's rate-limiting system with 20 simultaneous HTTP calls.



{

    @langchain/community contains dozens of document loaders, vector stores, and integrations. 
    
    To keep the main package size small, LangChain does not bundle heavy binary-parsing utilities directly inside @langchain/community.  
    
    Instead, PDFLoader acts as a wrapper module. When you execute await loader.load(), PDFLoader dynamically calls require("pdf-parse") or import("pdf-parse") in the background to handle the low-level parsing of the PDF file.
    
    Because pdf-parse is an optional peer dependency, npm does not install it when you install @langchain/community. You must install it manually in your project root

    It is optional for @langchain/community during installation, but mandatory for PDFLoader at execution
}


[
**Note :** If you see a dimension mismatch in pinecone one of the reasons can be the quota limit as **gemini-embedding-2-preview** allows 100 embeddings request per min then after 30 sec cooldown we can again do it (free tier limit)
]


So now if we query that **"explain it in detail"** it will give us explanation of the context obtained from vector DB

So first this query will be converted in vector embeddings and using that it will search in vector DB for top 10 results to give it as context to the LLM so the context received will be wrong as if this query is in continuation of previously asked question from user then context obtained from vector DB will be bad as it will only give context based on current query vector 

So it will explain the context obtained in detail only nothing else

So in this case vector DB made things worse

So in this case we will need something that will analyze the intent of the user

**So now we can give LLM the history of the chat and then ask it to give output in easy to understand question so using this question we can just search in vector DB for top K result and give context and question to LLM again**

So we can also give vector DB as a tool to LLM so that if it doesn't know anything then using context provided by vector DB it can answer for any specific topic


**Limitation of Normal RAG**

If we have a pdf consisting of all the things that user buys, so we use this to make a recommendation system so we ask our LLM suggest top 10 things we should recommend to let's say person X so it will only suggest those which person X has bought before as everything in vector DB is converted into vectors so all the vectors having person X names meaning all the things person X has bought will be the points closer to the query so due to this all the things that person X buys and it's own behaviour and pattern will be suggested to person X

So this is a bad recommendation system

So we will think like first we will get all the things user bought that person X has bought then will see which users bought the same things and using that we will see what all things these user bought that person X hasn't bought and will recommend these things to person X

So we will instead of giving question directly to vector DB we will give it to LLM and will ask it to break this query down into sub queries as a single query won't be able to find the correct answer in this case (this is called **Agentic RAG**)

Breaking down a complex query into multiple sub-queries, running iterative retrieval calls to a vector database, evaluating intermediate results, and executing multi-step workflows is the core defining characteristic of **Agentic RAG**.


[**Limitation of Agentic RAG**] But here **Agentic RAG** won't work in this case as if person X has bought 500 items then we are only fetching top 10, etc so we will miss half the items that could be recommended to person X and we also cannot just fetch top 500 items also as if person X has only 10 bought items and we bring 500 items then random things might be suggested as only 10 items were bought by person X (a person can also have 10000 items bought also)

So in short Agentic RAG and Normal RAG fails wherever the number of records needed to be fetched for context is variable like in above case each user has varaible buying history so due to that we cannot decide whether to fetch top 10 or top 500 (in cases it cannot find relationships as it only does semantic search)

Similarly if we have a case like A is father of B, B is father of C like this question and if we ask it relationship between 2 it will just fetch all the vectors that have those 2 person relation only, it won't fetch the intermediate relationships that will be useful for context


## GraphRAG


So to show relationship and all, the **Graph DB** comes into the picture

So first question we will ask is that why not SQL or NoSQL DB, why we need to use Graph DB

So if we take example of a social networking app like LinkedIn etc, so in LinkedIn it suggests us our connection's friend as suggestion and also their friends also 

So if we need to find friends of person X who are friends of friends of person X so we will be needed to do multiple queries in SQL DB like first as DB uses B+ Tree as we already know so in log(N) time we will find person X and then in O(1) we will find person X's friend then in log(N) time for each fetch of list of people friends with person X so if like let's say person X had 500 friends so to find friends of all these friends will take **500log(N)** time so if on average each friend has 500 friend so it will fetch 250,000 friends from DB and then will fetch their friends too if we want to know their friends too so 250000 log(N) time will be taken and we will get soo large list of friends 125,000,000 so our time taken to do all this will increase

So total time complexity will be log(N) + 500 * log(N) + 250,000 * log(N) so in both NoSQL and SQL DB this will happen whereas in SQL DB it will take more time as all this won't be stored in a single table so join operations will be performed and hence in SQL it will take more time and also if we have like million or billions of users then they can have millions or billions of friends also so then it would be problematic also


So how will we store data in Graph DB, one way is to store data like 

X : [Y, Z, A, D]
Y : [X, B, C]
Z : [Y, F, E]

So like this we can store data about connections like all the people that person X follows and like that we can store all the data in Graph DB

So we can improve this way of storing data by storing the memory address where the data about that person is actually stored instead of repeatedly storing the same data again and again like if person A follows person X so we will store their data too there and if person C also follows person X so storing person X's data there too so instead of this we will store memory address

As memory address will be of fixed size whereas the size of the data can be variable so less storage space will be consumed in this way


So now if we talk about scaling using this storage method so as we know DBs are in the end server or computer without monitors (as we need monitor to see things) so when millions of users come to our platform we will need to get more DBs and copy data there also to prevent single point of failure (SPOF) issue also

So if we store memory locations then we will copy this data in another DB but this is where the twist comes as it's not fixed that the new DB we add might have the same specs but even if we assume it has same specs then we cannot predict that if the data is actually stored at that location or not as system has their own processes running too so theirs no guarantee that the copied data will be stored exactly according to the memory location mentioned in data so we cannot store memory location as data to find data about a person as when scaling it will make inaccurate data as on one DB it will be correct but in the other it will be false



So we will store all the nodes or vertices together and all the edges or connection together

So we will take a DB in which we will only store the base address of the database and from that we will lookup for data, data will be stored in array form (cannot use linked list as we cannot hardcode the memory address for next node) of fixed sizes so now we can copy and transfer data to another DB also as all the data will be stored in contiguous memory locations so we will only need the base address to get the get of all the users

So with this we can safely scale the DBs (we will assume size of each node in this is 15 byte only)


So now in this 15 byte only we will be needed to store all the information about who all are the friends of person X so person X can have million friends and if we assume each friend to take 5 bytes then it won't fit in 15 bytes


So now as they cannot fit all the friends in just 15 bytes so we will create another array for it whose base address we will keep

So now we will lookup in 1st table to get from where on from which index does the relationship of person X start from in 2nd table so from that we will reserve 34 bytes for each index and in this also we will only store name of the friend and where next friend will be found so now using the index in table 1 we can find person X friend and then by using the next index pointer in table 2 we can get all the friends and when we encounter null this means that there are no other friends of person X and then we will also make a 3rd table where all the data of each user will be stored (the 3rd table is called the **property** table)


**[Note : Native Graph Databases (like Neo4j) still use B-Trees or B+ Trees, but they use them exclusively for the initial entry point lookups, not for traversing connections. After the initial finding they use these above discussed techniques to find data fast]**



