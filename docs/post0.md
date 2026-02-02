---
disable_toc: true
---

# Numerical diffusion

*by* [*Bernardo Collufio*](https://www.gssi.it/people/students/students-maths/item/24622-collufio-bernardo)

---
**Numerical methods for PDEs represent a well-established research field in Applied Mathematics, and their use as powerful tools for many real-world applications continues to attract interest from the international community. The performance of numerical techniques for solving PDEs can be significantly affected by several undesirable effects. One of these subtle effects, referred to as numerical diffusion, may lead—if not carefully analyzed and controlled—to results that are inconsistent with the underlying physics of the system.**

---
**Attached:** [transport.py](https://drive.google.com/file/d/1QDmBv0mDV0rtko7NOUEDxKOuw5foiEkP/view?usp=sharing), [transport.m](https://drive.google.com/file/d/18MtfnQGccdTnMliB9yGGQMmKaI_QbBgs/view?usp=sharing)

---

Let’s consider the initial value problem for $u=u(t,x)$

$$
\begin{equation}\left\{\begin{aligned}&\partial_tu+c\,\partial_xu=0,\qquad(t,x)\in[0,t_{max}]\times[x_{min},x_{max}],\\ &u(0,x)=u_0(x),\end{aligned}\right.\end{equation}
$$

with $c>0$, and introduce the discretization denoted by 

$$
u^n_{j}\approx u(t^n,x_j),
$$

$\{t^n\}_n,\{x_j\}_j$ being the usual uniformly distributed grid points 

$$
\Delta t=\frac{t_{max}}{N_t},\quad\Delta x=\frac{x_{max}-x_{min}}{N_x},\qquad t^n=n\,\Delta t,\quad x_j=x_{min}+j\Delta x.
$$

We want to investigate the consistence of the following numerical methods:

- **Explicit Upwind (first order accurate)**
    
    $$
    u^{n+1}_j=u^n_j-c\,\frac{\Delta t}{\Delta x}(u^n_j - u^n_{j-1}).
    $$
    
- **Lax-Friedrichs (first order accurate)**

$$
u^{n+1}_j=\frac{u^n_{j+1}+u^n_{j-1}}{2}-c\,\frac{\Delta t}{2\,\Delta x}(u^n_{j+1}-u^n_{j-1}).
$$

- **Lax-Wendroff (second order accurate)**

$$
u^{n+1}_j=u^n_j-c\frac{\Delta t}{2\,\Delta x}(u^n_{j+1}-u^n_{j-1})+c^2\,\frac{\Delta t^2}{2\,\Delta x^2}(u^n_{j+1}-2\,u^n_j+u^n_{j-1}).
$$

In fact, for $c>0$ all of these share the same CFL condition 

$$
\lambda := c\,\frac{\Delta t}{\Delta x}\leq1,
$$

which ensures their stability and prevent them from blowing up at finite time. However, the choice of $\lambda<1$ introduces a so-called **numerical diffusion** (or dissipation), consisting of a tendency to flatten (dissipate) the solution more and more after each time step. One can observe that the Lax-Friedrichs scheme is affected by a very strong diffusion, providing solutions which are physically inconsistent and even worse than those produced with the Explicit Upwind.

The solution to $(1)$ is given by 

$$
u(t,x)=u_0(x-c\,t),
$$

just consisting of a shift of the initial data in the right direction, with velocity $c$. In the Python (or MATLAB) script “transport.py” (or "transport.m") you can see a comparison of the three methods; I took a simple Gaussian function as initial data and I used periodic boundary conditions. We expect this Gaussian to be just transported to the right, but we can clearly see that the Explicit Upwind and the Lax-Friedrichs methods tend to flatten it. This effect is even more evident when we consider a smaller CFL value (you can do so by changing the value of the “cfl” variable in the Python or MATLAB script). On the other hand, picking $\lambda=1$ we are able to recover a perfect transport for both methods.

### So… we just need to put $\lambda=1$ to solve this issue?

Actually, in practice, this could be very dangerous. Numerical noise is always present in every algorithm; any number fed into the code is always affected by a round-off error, and even a microscopic round-off error on $\Delta t$, $\Delta x$ or $c$ may lead to a value of $\lambda$ greater than $1$ (hence, the code will blow up eventually!). The best choice is to take $\lambda$ slightly less than $1$. Take-home message: avoid the $\lambda=1$ shortcut.

## The modified equations

In this section I want to show you that this numerical effect can be actually deduced from our methods’ formulas through the so-called **modified equations,** and it can be also quantified; this will allow us to make a comparison of the methods above and justify what we observed numerically from the Python script.

Let us first consider the Explicit Upwind method. From a continuous perspective, we can naively interprete it as the outcome of a point-wise evaluation of the relation 

$$
u(t+\Delta t,x)=u(t,x)-c\frac{\Delta t}{\Delta x}(u(t,x)-u(t,x-\Delta x)),
$$

onto the points $\{(t^n,x_j)\}_{n,j}$; in some sense the method seeks for a function $u$ satisfying this relation. What if this function actually solves $(1)$? Let’s perform a Taylor expansion of $u(t+\Delta t,x)$ and $u(t,x-\Delta x)$ up to third order to get

$$
u+\Delta t\,\partial_t u+\frac{\Delta t^2}{2}\partial^2_{tt}u = u-c\frac{\Delta t}{\Delta x}\Bigg(\Delta x\,\partial_x u-\frac{\Delta x^2}{2}\partial^2_{xx}u\Bigg)+O(\Delta t^3,\Delta x^2\Delta t),
$$

where I omitted the arguments $(t,x)$ of $u$ and its derivatives for brevity. Assuming $u$ solves $(1)$, we have that 

$$
\partial^2_{tt}u=\partial_t(\partial_t u)=-c\,\partial_t(\partial_x u)=-c\,\partial_x(\partial_t u)=c^2\,\partial^2_{xx}u.
$$

Plugging this expression into the previous one and dividing everything by $\Delta t$ we get 

$$
\begin{aligned}\partial_tu+c\,\partial_xu&=\frac{c\,\Delta x}{2}\Bigg(1-c\frac{\Delta t}{\Delta x}\Bigg)\partial^2_{xx}u +O(\Delta t^2,\Delta x^2)\\&= \frac{c\,\Delta x}{2}(1-\lambda)\partial^2_{xx}u+O(\Delta t^2,\Delta x^2).\end{aligned}
$$

As you can see, we have first order consistence with the target equation,

$$
\partial_tu+c\,\partial_xu=O(\Delta x),
$$

and second order consistence with the **diffusive equation,**

$$
\partial_t u + c\,\partial_x u=\nu_{eu}\,\partial^2_{xx}u+O(\Delta t^2,\Delta x^2),
$$

with diffusion coefficient 

$$
\nu_{eu}=\frac{c\Delta x}{2}(1-\lambda);
$$

this is precisely the numerical diffusion of the Explicit Upwind method. We can perform the same computations for the Lax-Friedrichs method, obtaining

$$
\nu_{lf}=\frac{c\,\Delta x}{2}\frac{1-\lambda^2}{\lambda}.
$$

We can immediately observe that this becomes huge when $\lambda$ is small (go back to the Python script, take $\lambda=0.001$ and see what happens); moreover,

$$
\nu_{lf}=\frac{1+\lambda}{\lambda}\nu_{eu}>\nu_{eu},
$$

which justifies our numerical observations. Lastly, it is interesting to see that the same calculations for the Lax-Wendroff method lead to 

$$
\nu_{lw}=0.
$$

</aside>

### Exercise

Show that the Lax-Wendroff method has third order consistence with the **dispersive equation** 

$$
\partial_tu+c\,\partial_xu=\mu\,\partial^3_{xxx}u.
$$

</aside>
