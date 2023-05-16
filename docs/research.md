# Research & PhD Projects

The research interests of the group include:  

- Numerical integration of ODEs  
- Numerical solution of nonlinear eigenvector problems   
- Numerical linear algebra   
- Computational machine learning and data science   
- Spectral graph theory   
- Numerical Optimization 
- Analysis of complex networks   

and their applications to a wide range of real-world problems. Some specific topics of interest  are described below.


### Efficient training of stable implicit-depth neural networks

Supervised and semi-supervised classification are among the most important tasks in machine learning and data mining. The state-of-the-art techniques for both these two tasks are based on deep Neural Networks (NNs) or graph NNs. From a mathematical viewpoint, these models boil down to a regularized constrained optimization problem, 

$$\begin{cases} \min \ell(f(x),y) + \lambda \varphi(f) &  \newline
 \text{such that } f\in \mathcal F:=\\{f:f(x)=\sigma(W_k\sigma(\cdots \sigma(W_1\sigma(W_0 x))\cdots))\\} & 
\end{cases}$$

where the constraints form a function space \\( \mathcal F \\) parametrized by structured matrices \\(W = (W_0,\dots,W_k)\\), including Toeplitz and multilevel Toeplitz matrices (convolutional operators) and graph or hypergraph matrices (discrete Laplacian operators and graph-convolutional filters).

Recent work has shown the advantages of so-called implicit-depth or continuous-time neural networks, where the constraints in the NN optimization problem are defined via a nonlinear system of ODEs or PDEs, i.e. for instance we replace \\(f\in \mathcal F\\) with a differential equation of the form \\( \dot f = f(W,t)\\). Popular instances of this type of NN models are so-called Neural ODE  and Deep Equilibrium Models. These approaches, which trace back to early work on recurrent backpropagation, have a number of advantages: (a) they have been recently shown to match or even exceed the performance of traditional NNs on time series and image data (e.g. sequence modeling); (b) memory-wise, they are drastically more efficient than traditional NNs as backpropagation is done analytically and does not require to store internal weights, allowing to efficiently handle deeper architectures.

While prediction accuracy of NN-based models has reached extraordinary performance, their potential instability with respect to adversarial attacks is a major limitation and one of the most important challenges in the field. Having guarantees of robustness against adversarial attacks is an essential requirement for the application of NNs in the society. In an unstable dynamical system, small perturbations of the initial state (the training dataset) may lead to very different solutions, thus a stable continuous-time NN architecture is an essential requirement for robustness against adversarial attacks. The obvious approach to ensure stability is to restrict the constraints set (the structure of the admissible functions), for example by limiting the matrix parameters to skew-Hermitian convolutional operators of the form
$$
W = -BB^\top,\qquad W = \begin{bmatrix} & B^\top \newline -B & \end{bmatrix}\, . 
$$
However, this approach further constrains the admissible functions set and reduces the applicability of the NN classifier and its classification performance.

Leveraging recent techniques from matrix stability theory, we aim at developing new training algorithms for implicit-depth NN which will ensure forward (and, subsequently, backward) stability with the least reduction in terms of admissible constraint parameters.  Methods from numerical ODEs and numerical linear algebra will be used to handle the differential nature of the problem and the large structured matrices involved as well as to prove the convergence of the training algorithm. Our numerical schemes will take advantage of the structure of convolutional operators and graph matrices to ensure efficiency in the training process and performance in terms of classification accuracy.


<!-- 
We aim at produce a dedicated software library, which will be made available through a public-domain repository. This will directly impact the machine learning community. Methods from numerical ODEs and numerical linear algebra will be used to handle the differential nature of the problem and the large structured matrices involved as well as to prove the convergence of the training algorithm. Our numerical schemes will take advantage of the structure of convolutional operators and graph matrices to ensure efficiency in the training process and performance in terms of classification accuracy. Thus, we expect the results will impact the numerical community as well. Furthermore, we expect to branch out beyond supervised and semi-supervised classification, and we envision the new techniques will be applicable in other data mining settings, including the stability of graph centrality, anomaly detection, and link prediction algorithms [8].  -->




### Numerical integration of nonsmooth dynamical systems 
The numerical treatment of differential equations usually relies on smoothness assumptions which play a fundamental role in the development of suitable schemes and in their convergence analysis. However, an emergent field of interest is systems of ODEs with discontinuous right hand side and many applications can be found in control theory (bang-bang controls), mechanical systems (dry friction) biology (gene regulatory networks), chemistry (gas liquid models). In most mathematical models described by discontinuous ODEs the vector field is piecewise smooth in subregions separated by manifolds and discontinuities take place across the manifolds. The existence and uniqueness of solutions are not anymore guaranteed at such interfaces and the classical Filippov theory becomes ambiguous when the discontinuity manifolds have co-dimension greater than 1. Infinitely many vector fields could be selected along the discontinuity manifolds and the corresponding solutions might have different qualitative behavior. This issue clearly affects also the numerical approximation of the solutions. Our aim is to investigate physical regularizations so to allow one to select a Filippov solution that has physical relevance. If we can show that the solutions of the regularized system converge uniformly to a particular Filippov solution, then we can select this solution for the discontinuous problem. The persistence of the qualitative behavior of solutions under regularization is fundamental if we wish to replace the discontinuous system with the regular one or viceversa, hence we will investigate this persistence as well. At the state of the art, numerical techniques for discontinuous problems, even though efficient, need to select a priori a sliding vector field in Filippov convex combination. Our studies would give rigorous theoretical justifications to make such selection in agreement with the original real life model that one wishes to simulate. Our research project focuses on getting new theoretical insight into numerical approaches and on exploiting this insight for the design and implementation of efficient algorithms.

<!-- Informal enquiries can be made to Nicola Guglielmi (nicola.guglielmi@gssi.it) -->
 


### Computational network science
Networks are a very powerful tool to model complex systems and analyze large data. For example, in exploratory data analysis we are often interested in finding clusters or communities, or assessing the importance (or centrality) of datapoints. As many real-world systems feature geographical, temporal, or categorical metadata and higher-order structures (motifs), models based on higher-order graphs such as hypergraphs, multilayer graphs and simplicial complexes are nowadays becoming prevalent.
We are interested in developing both theoretical foundations and efficient algorithms for a range of network analysis problems. We are particularly interested in methods that exploit matrix and tensor representations of the data to approximately solve related combinatorial optimization problems such as community detection, clustering, core-periphery analysis.



### Spectral methods for machine learning
Spectral methods play a fundamental role in machine learning, statistics, and data mining.
Methods for important tasks such as clustering, semi-supervised learning, dimensionality reduction, latent factor models, ranking and preference learning and covariance estimation
all use information about eigenvalues and eigenvectors (or singular values and singular vectors) from an underlying data matrix.
Even though spectral methods are both powerful and convenient, they often rely on a linear approximation of the ideal learning problem which sometimes yields inaccurate results. We are interested in developing spectral methods that are based on nonlinear eigenvalue problems with eigenvector nonlinearities. This class of eigenvector methods is very broad and includes several nonlinear dimensionality reduction models and tight relaxation of cut functions, to name some. Moreover, it allows us to develop numerical linear algebra tools to efficiently perform the nonlinear spectral methods.  
