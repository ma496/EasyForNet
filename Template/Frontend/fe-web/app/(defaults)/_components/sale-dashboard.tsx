'use client';
import Dropdown from '@/components/dropdown';
import IconCreditCard from '@/components/icon/icon-credit-card';
import IconDollarSign from '@/components/icon/icon-dollar-sign';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconInbox from '@/components/icon/icon-inbox';
import IconShoppingCart from '@/components/icon/icon-shopping-cart';
import IconTag from '@/components/icon/icon-tag';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAppSelector } from '@/store/hooks';

const SaleDashboard = () => {
  const isDark = useAppSelector((state) => state.theme.theme === 'dark' || state.theme.isDarkMode);
  const isRtl = useAppSelector((state) => state.theme.rtlClass) === 'rtl';

  const [isMounted, setIsMounted] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update charts when theme changes
  useEffect(() => {
    if (isMounted) {
      setChartKey(prev => prev + 1);
    }
  }, [isDark, isMounted]);

  //Revenue Chart
  const revenueChart: any = {
    series: [
      {
        name: 'Income',
        data: [18500, 19200, 17800, 21500, 18900, 22000, 24500, 23000, 21800, 25000, 23500, 26000],
      },
      {
        name: 'Expenses',
        data: [15800, 16300, 15000, 16500, 15200, 17800, 14500, 15200, 14800, 16500, 15800, 17200],
      },
    ],
    options: {
      chart: {
        height: 325,
        type: 'area',
        fontFamily: 'Nunito, sans-serif',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: 'smooth',
        width: 2,
        lineCap: 'square',
      },
      dropShadow: {
        enabled: true,
        opacity: 0.2,
        blur: 10,
        left: -7,
        top: 22,
      },
      colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
      markers: {
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 6,
            fillColor: '#1B55E2',
            strokeColor: 'transparent',
            size: 7,
          },
          {
            seriesIndex: 1,
            dataPointIndex: 5,
            fillColor: '#E7515A',
            strokeColor: 'transparent',
            size: 7,
          },
        ],
      },
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: true,
        },
        labels: {
          offsetX: isRtl ? 2 : 0,
          offsetY: 5,
          style: {
            fontSize: '12px',
            cssClass: 'apexcharts-xaxis-title',
          },
        },
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: (value: number) => {
            return value / 1000 + 'K';
          },
          offsetX: isRtl ? -30 : -10,
          offsetY: 0,
          style: {
            fontSize: '12px',
            cssClass: 'apexcharts-yaxis-title',
          },
        },
        opposite: isRtl ? true : false,
      },
      grid: {
        borderColor: isDark ? '#191E3A' : '#E0E6ED',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '16px',
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      tooltip: {
        marker: {
          show: true,
        },
        x: {
          show: false,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: isDark ? 0.19 : 0.28,
          opacityTo: 0.05,
          stops: isDark ? [100, 100] : [45, 100],
        },
      },
    },
  };

  //Sales By Category
  const salesByCategory: any = {
    series: [1250, 850, 420],
    options: {
      chart: {
        type: 'donut',
        height: 460,
        fontFamily: 'Nunito, sans-serif',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 25,
        colors: isDark ? '#0e1726' : '#fff',
      },
      colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        height: 50,
        offsetY: 20,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '29px',
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: '26px',
                color: isDark ? '#bfc9d4' : undefined,
                offsetY: 16,
                formatter: (val: any) => {
                  return val;
                },
              },
              total: {
                show: true,
                label: 'Total',
                color: '#888ea8',
                fontSize: '29px',
                formatter: (w: any) => {
                  return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      labels: ['Apparel', 'Sports', 'Others'],
      states: {
        hover: {
          filter: {
            type: 'none',
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: 'none',
            value: 0.15,
          },
        },
      },
    },
  };

  //Daily Sales
  const dailySales: any = {
    series: [
      {
        name: 'Sales',
        data: [58, 65, 72, 83, 59, 75, 68],
      },
      {
        name: 'Last Week',
        data: [42, 53, 48, 35, 41, 62, 55],
      },
    ],
    options: {
      chart: {
        height: 160,
        type: 'bar',
        fontFamily: 'Nunito, sans-serif',
        toolbar: {
          show: false,
        },
        stacked: true,
        stackType: '100%',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
      },
      colors: ['#e2a03f', '#e0e6ed'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      xaxis: {
        labels: {
          show: false,
        },
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
      },
      yaxis: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%',
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
        xaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 10,
          right: -20,
          bottom: -20,
          left: -20,
        },
      },
    },
  };

  //Total Orders
  const totalOrders: any = {
    series: [
      {
        name: 'Sales',
        data: [45, 52, 49, 65, 58, 72, 63, 75, 60, 68],
      },
    ],
    options: {
      chart: {
        height: 290,
        type: 'area',
        fontFamily: 'Nunito, sans-serif',
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      colors: isDark ? ['#00ab55'] : ['#00ab55'],
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      yaxis: {
        min: 0,
        show: false,
      },
      grid: {
        padding: {
          top: 125,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      fill: {
        opacity: 1,
        type: 'gradient',
        gradient: {
          type: 'vertical',
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: 0.3,
          opacityTo: 0.05,
          stops: [100, 100],
        },
      },
      tooltip: {
        x: {
          show: false,
        },
      },
    },
  };

  return (
    <>
      <div>
        <div className="pt-5">
          <div className="mb-6 grid gap-6 xl:grid-cols-3">
            <div className="panel h-full xl:col-span-2">
              <div className="mb-5 flex items-center justify-between dark:text-white-light">
                <h5 className="text-lg font-semibold">Revenue</h5>
                <div className="dropdown">
                  <Dropdown
                    offset={[0, 1]}
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    button={<IconHorizontalDots className="text-black/70 hover:!text-primary dark:text-white/70" />}
                  >
                    <ul>
                      <li>
                        <button type="button">Weekly</button>
                      </li>
                      <li>
                        <button type="button">Monthly</button>
                      </li>
                      <li>
                        <button type="button">Yearly</button>
                      </li>
                    </ul>
                  </Dropdown>
                </div>
              </div>
              <p className="text-lg dark:text-white-light/90">
                Total Profit <span className="ml-2 text-primary">$18,750</span>
              </p>
              <div className="relative">
                <div className="rounded-lg bg-white dark:bg-black">
                  {isMounted ? (
                    <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} width={'100%'} />
                  ) : (
                    <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                      <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="panel h-full">
              <div className="mb-5 flex items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Sales By Category</h5>
              </div>
              <div>
                <div className="rounded-lg bg-white dark:bg-black">
                  {isMounted ? (
                    <ReactApexChart
                      key={`sales-by-category-${chartKey}`}
                      series={salesByCategory.series}
                      options={salesByCategory.options}
                      type="donut"
                      height={460}
                      width={'100%'}
                    />
                  ) : (
                    <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                      <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <div className="panel h-full sm:col-span-2 xl:col-span-1">
              <div className="mb-5 flex items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">
                  Daily Sales
                  <span className="block text-sm font-normal text-white-dark">Go to columns for details.</span>
                </h5>
                <div className="relative ltr:ml-auto rtl:mr-auto">
                  <div className="grid h-11 w-11 place-content-center rounded-full bg-[#ffeccb] text-warning dark:bg-warning dark:text-[#ffeccb]">
                    <IconDollarSign />
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-lg bg-white dark:bg-black">
                  {isMounted ? (
                    <ReactApexChart series={dailySales.series} options={dailySales.options} type="bar" height={160} width={'100%'} />
                  ) : (
                    <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                      <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="panel h-full">
              <div className="mb-5 flex items-center justify-between dark:text-white-light">
                <h5 className="text-lg font-semibold">Summary</h5>
                <div className="dropdown">
                  <Dropdown
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    button={<IconHorizontalDots className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70" />}
                  >
                    <ul>
                      <li>
                        <button type="button">View Report</button>
                      </li>
                      <li>
                        <button type="button">Edit Report</button>
                      </li>
                      <li>
                        <button type="button">Mark as Done</button>
                      </li>
                    </ul>
                  </Dropdown>
                </div>
              </div>
              <div className="space-y-9">
                <div className="flex items-center">
                  <div className="h-9 w-9 ltr:mr-3 rtl:ml-3">
                    <div className="grid h-9 w-9 place-content-center  rounded-full bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light">
                      <IconInbox />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex font-semibold text-white-dark">
                      <h6>Income</h6>
                      <p className="ltr:ml-auto rtl:mr-auto">$125,800</p>
                    </div>
                    <div className="h-2 rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                      <div className="h-full w-11/12 rounded-full bg-gradient-to-r from-[#7579ff] to-[#b224ef]"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-9 w-9 ltr:mr-3 rtl:ml-3">
                    <div className="grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light">
                      <IconTag />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex font-semibold text-white-dark">
                      <h6>Profit</h6>
                      <p className="ltr:ml-auto rtl:mr-auto">$52,350</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-[#3cba92] to-[#0ba360]" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-9 w-9 ltr:mr-3 rtl:ml-3">
                    <div className="grid h-9 w-9 place-content-center rounded-full bg-warning-light text-warning dark:bg-warning dark:text-warning-light">
                      <IconCreditCard />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex font-semibold text-white-dark">
                      <h6>Expenses</h6>
                      <p className="ltr:ml-auto rtl:mr-auto">$73,450</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-[#f09819] to-[#ff5858]" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel h-full p-0">
              <div className="absolute flex w-full items-center justify-between p-5">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success-light text-success dark:bg-success dark:text-success-light">
                    <IconShoppingCart />
                  </div>
                </div>
                <h5 className="text-2xl font-semibold ltr:text-right rtl:text-left dark:text-white-light">
                  4,875
                  <span className="block text-sm font-normal">Total Orders</span>
                </h5>
              </div>
              <div className="rounded-lg bg-transparent">
                {/* loader */}
                {isMounted ? (
                  <ReactApexChart series={totalOrders.series} options={totalOrders.options} type="area" height={290} width={'100%'} />
                ) : (
                  <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                    <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaleDashboard;
